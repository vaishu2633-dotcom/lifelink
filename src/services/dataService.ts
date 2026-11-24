import {
  Donor,
  BloodBank,
  BloodInventoryItem,
  BloodRequest,
  DonationCamp,
  College,
  NotificationItem,
  DonorResponse,
  BloodGroup,
  RequestStatus
} from '../types';
import {
  INITIAL_DONORS,
  INITIAL_BLOOD_BANKS,
  INITIAL_INVENTORY,
  INITIAL_REQUESTS,
  INITIAL_COLLEGES,
  INITIAL_CAMPS,
  INITIAL_NOTIFICATIONS
} from './mockData';
import { calculateMatchScore } from '../utils/compatibility';

// Local storage keys
const STORAGE_KEYS = {
  DONORS: 'lifelink_donors',
  BLOOD_BANKS: 'lifelink_blood_banks',
  INVENTORY: 'lifelink_inventory',
  REQUESTS: 'lifelink_requests',
  RESPONSES: 'lifelink_responses',
  COLLEGES: 'lifelink_colleges',
  CAMPS: 'lifelink_camps',
  NOTIFICATIONS: 'lifelink_notifications'
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

class DataService {
  private donors: Donor[];
  private bloodBanks: BloodBank[];
  private inventory: BloodInventoryItem[];
  private requests: BloodRequest[];
  private responses: DonorResponse[];
  private colleges: College[];
  private camps: DonationCamp[];
  private notifications: NotificationItem[];

  constructor() {
    this.donors = getFromStorage<Donor[]>(STORAGE_KEYS.DONORS, INITIAL_DONORS);
    this.bloodBanks = getFromStorage<BloodBank[]>(STORAGE_KEYS.BLOOD_BANKS, INITIAL_BLOOD_BANKS);
    this.inventory = getFromStorage<BloodInventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    this.requests = getFromStorage<BloodRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    this.responses = getFromStorage<DonorResponse[]>(STORAGE_KEYS.RESPONSES, [
      {
        id: 'resp-1',
        request_id: 'req-sos-1',
        donor_id: 'donor-2',
        donor_name: 'Priya Deshmukh',
        donor_phone: '+91 98224 88712',
        donor_blood_group: 'O-',
        status: 'confirmed',
        message: 'On my way to Lilavati Hospital blood bank right now.',
        created_at: '2026-11-04T12:45:00Z'
      },
      {
        id: 'resp-2',
        request_id: 'req-sos-1',
        donor_id: 'donor-1',
        donor_name: 'Aarav Sharma',
        donor_phone: '+91 98230 11234',
        donor_blood_group: 'O+',
        status: 'interested',
        message: 'Available in Bandra within 20 mins if backup required.',
        created_at: '2026-11-04T12:50:00Z'
      }
    ]);
    this.colleges = getFromStorage<College[]>(STORAGE_KEYS.COLLEGES, INITIAL_COLLEGES);
    this.camps = getFromStorage<DonationCamp[]>(STORAGE_KEYS.CAMPS, INITIAL_CAMPS);
    this.notifications = getFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  // --- DONORS ---
  public getDonors(): Donor[] {
    return [...this.donors];
  }

  public getDonorById(id: string): Donor | undefined {
    return this.donors.find(d => d.id === id || d.user_id === id);
  }

  public toggleDonorAvailability(donorId: string): boolean {
    const donor = this.donors.find(d => d.id === donorId || d.user_id === donorId);
    if (donor) {
      donor.is_available = !donor.is_available;
      saveToStorage(STORAGE_KEYS.DONORS, this.donors);
      return donor.is_available;
    }
    return false;
  }

  public addDonor(donor: Donor): void {
    this.donors.unshift(donor);
    saveToStorage(STORAGE_KEYS.DONORS, this.donors);
  }

  public updateDonor(updated: Partial<Donor> & { id: string }): void {
    const index = this.donors.findIndex(d => d.id === updated.id);
    if (index !== -1) {
      this.donors[index] = { ...this.donors[index], ...updated };
      saveToStorage(STORAGE_KEYS.DONORS, this.donors);
    }
  }

  public verifyDonor(donorId: string, isVerified: boolean): void {
    const donor = this.donors.find(d => d.id === donorId);
    if (donor) {
      donor.is_verified = isVerified;
      saveToStorage(STORAGE_KEYS.DONORS, this.donors);
    }
  }

  // Smart Search & Match
  public searchCompatibleDonors(params: {
    bloodGroup: BloodGroup;
    city: string;
    area?: string;
    onlyAvailable?: boolean;
    urgency?: string;
  }): Array<{ donor: Donor; matchInfo: ReturnType<typeof calculateMatchScore> }> {
    return this.donors
      .map(donor => {
        const matchInfo = calculateMatchScore(donor, {
          blood_group: params.bloodGroup,
          city: params.city,
          area: params.area
        });
        return { donor, matchInfo };
      })
      .filter(item => {
        if (!item.matchInfo.isCompatible) return false;
        if (params.onlyAvailable && !item.donor.is_available) return false;
        if (params.city && item.donor.city.toLowerCase() !== params.city.toLowerCase() && item.matchInfo.proximityScore <= 5) {
          // Keep if exact or ultra-compatible rare, otherwise soft filter
          return item.matchInfo.score > 40;
        }
        return true;
      })
      .sort((a, b) => b.matchInfo.score - a.matchInfo.score);
  }

  // --- BLOOD REQUESTS & EMERGENCY SOS ---
  public getRequests(): BloodRequest[] {
    return [...this.requests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getSOSRequests(): BloodRequest[] {
    return this.requests.filter(r => r.is_sos || r.urgency === 'critical_sos');
  }

  public createRequest(req: Omit<BloodRequest, 'id' | 'created_at' | 'responses_count'>): BloodRequest {
    const newReq: BloodRequest = {
      ...req,
      id: `req-${Date.now()}`,
      created_at: new Date().toISOString(),
      responses_count: 0
    };
    this.requests.unshift(newReq);
    saveToStorage(STORAGE_KEYS.REQUESTS, this.requests);

    // Notify matching donors
    if (newReq.is_sos || newReq.urgency === 'critical_sos') {
      this.pushNotification({
        title: `CRITICAL SOS: ${newReq.blood_group} Needed at ${newReq.hospital_name}`,
        message: `Emergency blood request for patient ${newReq.patient_name} in ${newReq.city}.`,
        type: 'emergency',
        user_id: 'all',
        link: '/emergency-sos'
      });
    }

    return newReq;
  }

  public updateRequestStatus(requestId: string, status: RequestStatus): void {
    const req = this.requests.find(r => r.id === requestId);
    if (req) {
      req.status = status;
      if (status === 'fulfilled') {
        req.fulfilled_at = new Date().toISOString();
      }
      saveToStorage(STORAGE_KEYS.REQUESTS, this.requests);
    }
  }

  public respondToRequest(response: Omit<DonorResponse, 'id' | 'created_at'>): DonorResponse {
    const newResp: DonorResponse = {
      ...response,
      id: `resp-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.responses.unshift(newResp);
    saveToStorage(STORAGE_KEYS.RESPONSES, this.responses);

    // Increment response counter on the request
    const req = this.requests.find(r => r.id === response.request_id);
    if (req) {
      req.responses_count = (req.responses_count || 0) + 1;
      if (req.status === 'pending') {
        req.status = 'donor_contacted';
      }
      saveToStorage(STORAGE_KEYS.REQUESTS, this.requests);
    }

    return newResp;
  }

  public getResponsesForRequest(requestId: string): DonorResponse[] {
    return this.responses.filter(r => r.request_id === requestId);
  }

  // --- BLOOD BANKS & INVENTORY ---
  public getBloodBanks(): BloodBank[] {
    return [...this.bloodBanks];
  }

  public getBloodBankById(id: string): BloodBank | undefined {
    return this.bloodBanks.find(b => b.id === id);
  }

  public verifyBloodBank(bankId: string, isVerified: boolean): void {
    const bank = this.bloodBanks.find(b => b.id === bankId);
    if (bank) {
      bank.is_verified = isVerified;
      saveToStorage(STORAGE_KEYS.BLOOD_BANKS, this.bloodBanks);
    }
  }

  public getInventory(): BloodInventoryItem[] {
    return [...this.inventory];
  }

  public getInventoryByBank(bankId: string): BloodInventoryItem[] {
    return this.inventory.filter(i => i.blood_bank_id === bankId);
  }

  public addInventoryItem(item: Omit<BloodInventoryItem, 'id' | 'status'>): BloodInventoryItem {
    const today = new Date();
    const expiry = new Date(item.expiry_date);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'safe' | 'expiring_soon' | 'expired' = 'safe';
    if (diffDays < 0) status = 'expired';
    else if (diffDays <= 7) status = 'expiring_soon';

    const newItem: BloodInventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      status
    };
    this.inventory.unshift(newItem);
    saveToStorage(STORAGE_KEYS.INVENTORY, this.inventory);
    return newItem;
  }

  public updateInventoryUnits(itemId: string, newUnits: number): void {
    const item = this.inventory.find(i => i.id === itemId);
    if (item) {
      item.units = Math.max(0, newUnits);
      saveToStorage(STORAGE_KEYS.INVENTORY, this.inventory);
    }
  }

  public getExpiringInventory(bankId?: string): BloodInventoryItem[] {
    const items = bankId ? this.getInventoryByBank(bankId) : this.inventory;
    const today = new Date();
    return items.filter(i => {
      const expiry = new Date(i.expiry_date);
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && i.units > 0;
    });
  }

  // --- COLLEGES ---
  public getColleges(): College[] {
    return [...this.colleges].sort((a, b) => b.total_units_donated - a.total_units_donated);
  }

  public registerCollege(college: Omit<College, 'id' | 'rank' | 'total_donors' | 'total_units_donated'>): College {
    const newCollege: College = {
      ...college,
      id: `col-${Date.now()}`,
      rank: this.colleges.length + 1,
      total_donors: 0,
      total_units_donated: 0
    };
    this.colleges.push(newCollege);
    saveToStorage(STORAGE_KEYS.COLLEGES, this.colleges);
    return newCollege;
  }

  // --- CAMPS ---
  public getCamps(): DonationCamp[] {
    return [...this.camps].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  public registerForCamp(campId: string, donorName: string, donorPhone: string, donorBloodGroup: BloodGroup): boolean {
    const camp = this.camps.find(c => c.id === campId);
    if (camp) {
      camp.registered_count += 1;
      saveToStorage(STORAGE_KEYS.CAMPS, this.camps);
      return true;
    }
    return false;
  }

  public createCamp(camp: Omit<DonationCamp, 'id' | 'registered_count' | 'collected_units'>): DonationCamp {
    const newCamp: DonationCamp = {
      ...camp,
      id: `camp-${Date.now()}`,
      registered_count: 0,
      collected_units: 0
    };
    this.camps.unshift(newCamp);
    saveToStorage(STORAGE_KEYS.CAMPS, this.camps);
    return newCamp;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId?: string): NotificationItem[] {
    if (!userId || userId === 'all') return [...this.notifications];
    return this.notifications.filter(n => n.user_id === userId || n.user_id === 'all');
  }

  public pushNotification(item: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>): void {
    const notif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_read: false
    };
    this.notifications.unshift(notif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  public markNotificationAsRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    }
  }

  // --- ADMIN STATS ---
  public getAdminStats() {
    const totalDonors = this.donors.length;
    const totalRequests = this.requests.length;
    const fulfilledRequests = this.requests.filter(r => r.status === 'fulfilled').length;
    const pendingRequests = this.requests.filter(r => r.status === 'pending').length;
    const emergencyRequests = this.requests.filter(r => r.is_sos || r.urgency === 'critical_sos').length;
    const totalBloodBanks = this.bloodBanks.length;
    const totalCamps = this.camps.length;
    const totalColleges = this.colleges.length;

    const totalStockUnits = this.inventory.reduce((sum, item) => sum + item.units, 0);
    const expiringStockUnits = this.getExpiringInventory().reduce((sum, item) => sum + item.units, 0);

    return {
      totalDonors,
      totalRequests,
      fulfilledRequests,
      pendingRequests,
      emergencyRequests,
      totalBloodBanks,
      totalCamps,
      totalColleges,
      totalStockUnits,
      expiringStockUnits
    };
  }
}

export const dataService = new DataService();
