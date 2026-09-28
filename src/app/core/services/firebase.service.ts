import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { ProposalData } from '../models/proposal.model';

declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db: Firestore | null = null;
  private auth: Auth | null = null;
  
  readonly isReady = signal(false);
  readonly appId = typeof __app_id !== 'undefined' ? __app_id : 'portfolio-designer-app';

  constructor() {
    this.initFirebase();
  }

  private async initFirebase(): Promise<void> {
    try {
      const config = typeof __firebase_config !== 'undefined'
        ? JSON.parse(__firebase_config)
        : { projectId: 'mock-project' };
        
      const app = initializeApp(config);
      this.db = getFirestore(app);
      this.auth = getAuth(app);

      const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
      
      if (token) {
        await signInWithCustomToken(this.auth, token);
      } else {
        await signInAnonymously(this.auth);
      }
      this.isReady.set(true);
    } catch (error) {
      console.error('Firebase Initialization Error:', error);
    }
  }

  async submitProposal(data: ProposalData): Promise<unknown> {
    if (!this.isReady() || !this.auth?.currentUser || !this.db) {
      throw new Error('Servidor indisponível no momento.');
    }
    const proposalsRef = collection(this.db, 'artifacts', this.appId, 'public', 'data', 'proposals');
    return addDoc(proposalsRef, {
      ...data,
      createdAt: serverTimestamp(),
      status: 'new'
    });
  }
}
