import { Injectable, signal } from '@angular/core';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { ProposalData } from '../models/proposal.model';
import { AuditLog } from '../models/project.model';
import { environment } from '../../../environments/environment';

declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private auth: Auth | null = null;

  readonly isReady = signal(false);
  readonly appId = typeof __app_id !== 'undefined' ? __app_id : (environment.firebase?.appId || 'portfolio-designer-app');

  constructor() {
    this.initFirebase();
  }

  private initFirebase(): void {
    try {
      let config = null;
      if (typeof __firebase_config !== 'undefined') {
        config = JSON.parse(__firebase_config);
      } else if (environment.firebase && environment.firebase.apiKey) {
        config = environment.firebase;
      }

      if (config) {
        this.app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.isReady.set(true);
      }
    } catch (error) {
      console.warn('Firebase init notice: operando em modo offline/desenvolvimento:', error);
    }
  }

  getAuthInstance(): Auth | null {
    return this.auth;
  }

  getDbInstance(): Firestore | null {
    return this.db;
  }

  async loginWithGoogle(): Promise<FirebaseUser | null> {
    if (!this.auth) {
      return null;
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(this.auth, provider);
    return result.user;
  }

  async logout(): Promise<void> {
    if (this.auth) {
      await signOut(this.auth);
    }
  }

  async submitProposal(data: ProposalData): Promise<unknown> {
    if (this.db) {
      const proposalsRef = collection(this.db, 'projectRequests');
      return addDoc(proposalsRef, {
        ...data,
        createdAt: serverTimestamp(),
        status: 'Orçamento'
      });
    }
    return null;
  }

  async addAuditLog(log: AuditLog): Promise<void> {
    if (this.db) {
      const logsRef = collection(this.db, 'auditLogs');
      await addDoc(logsRef, {
        ...log,
        createdAt: serverTimestamp()
      });
    }
  }
}
