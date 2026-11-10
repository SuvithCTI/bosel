/**
 * BSEL Academy API Client
 * Seamlessly interfaces with Node.js backend (Neon Postgres & Amazon S3),
 * with intelligent fallback to local browser storage when running standalone.
 */

import { getRegisteredUsers, addUserAccount, deleteUserAccount } from '../utils/authStorage';
import { getStoredCourses, addStoredCourse, deleteStoredCourse } from '../data/coursesData';
import { getStoredEvents, addStoredEvent, deleteStoredEvent } from '../data/eventsData';
import { getStoredFranchiseLeads, addFranchiseLead, deleteFranchiseLead } from '../data/franchiseData';
import { getStoredPayments, addStoredPayment, deletePayment } from '../data/paymentsData';
import { getStoredSchools, addStoredSchool, deleteStoredSchool } from '../data/schoolsData';
import { getStoredBatches, addStoredBatch, deleteStoredBatch } from '../data/batchesData';

const API_BASE = '/api';

/**
 * Universal safe fetcher with timeout and fallback
 */
async function apiRequest(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.debug(`[API Fallback] ${endpoint}: ${err.message}. Using client fallback.`);
    return null;
  }
}

export const api = {
  // Health & Provider Info
  async getHealth() {
    return await apiRequest('/health');
  },

  // S3 / Local File Upload (supports File, Blob, and base64 Data URLs)
  async uploadFile(fileOrDataUrl, folder = 'general') {
    let file = fileOrDataUrl;
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      try {
        const fetchRes = await fetch(fileOrDataUrl);
        const blob = await fetchRes.blob();
        const ext = fileOrDataUrl.includes('image/png') ? 'png' : 'jpg';
        file = new File([blob], `upload_${Date.now()}.${ext}`, { type: blob.type || 'image/jpeg' });
      } catch {
        return { success: true, url: fileOrDataUrl, storage: 'local-base64' };
      }
    }

    if (file instanceof Blob || file instanceof File) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.url) return data;
        }
      } catch (err) {
        console.debug('[Upload fallback]:', err.message);
      }
    }

    if (typeof fileOrDataUrl === 'string') {
      return { success: true, url: fileOrDataUrl, storage: 'local-base64' };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({
        success: true,
        url: e.target.result,
        storage: 'local-base64'
      });
      reader.readAsDataURL(file);
    });
  },

  // Students & Users
  students: {
    async getAll(branch = '') {
      const query = branch ? `?branch=${encodeURIComponent(branch)}` : '';
      const data = await apiRequest(`/students${query}`);
      if (data && data.success && Array.isArray(data.students) && data.students.length > 0) {
        return data.students;
      }
      return getRegisteredUsers();
    },

    async create(studentData) {
      const data = await apiRequest('/students', {
        method: 'POST',
        body: JSON.stringify(studentData)
      });
      if (data && data.success && data.student) {
        return data.student;
      }
      return addUserAccount(studentData);
    },

    async update(id, studentData) {
      const data = await apiRequest(`/students/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(studentData)
      });
      if (data && data.success && data.student) {
        return data.student;
      }
      return studentData;
    },

    async delete(id) {
      const data = await apiRequest(`/students/${id}`, { method: 'DELETE' });
      deleteUserAccount(id);
      return data || { success: true };
    }
  },

  // Courses
  courses: {
    async getAll() {
      const data = await apiRequest('/courses');
      if (data && data.success && Array.isArray(data.courses) && data.courses.length > 0) {
        return data.courses;
      }
      return getStoredCourses();
    },

    async create(course) {
      const data = await apiRequest('/courses', {
        method: 'POST',
        body: JSON.stringify(course)
      });
      if (data && data.success && data.course) return data.course;
      return addStoredCourse(course);
    },

    async delete(id) {
      await apiRequest(`/courses/${id}`, { method: 'DELETE' });
      return deleteStoredCourse(id);
    }
  },

  // Events
  events: {
    async getAll() {
      const data = await apiRequest('/events');
      if (data && data.success && Array.isArray(data.events) && data.events.length > 0) {
        return data.events;
      }
      return getStoredEvents();
    },

    async create(event) {
      const data = await apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(event)
      });
      if (data && data.success && data.event) return data.event;
      return addStoredEvent(event);
    },

    async delete(id) {
      await apiRequest(`/events/${id}`, { method: 'DELETE' });
      return deleteStoredEvent(id);
    }
  },

  // Franchise Enquiries
  franchise: {
    async getAll() {
      const data = await apiRequest('/franchise');
      if (data && data.success && Array.isArray(data.leads) && data.leads.length > 0) {
        return data.leads;
      }
      return getStoredFranchiseLeads();
    },

    async create(lead) {
      const data = await apiRequest('/franchise', {
        method: 'POST',
        body: JSON.stringify(lead)
      });
      if (data && data.success && data.lead) return data.lead;
      return addFranchiseLead(lead);
    },

    async updateStatus(id, status) {
      return await apiRequest(`/franchise/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    },

    async delete(id) {
      await apiRequest(`/franchise/${id}`, { method: 'DELETE' });
      return deleteFranchiseLead(id);
    }
  },

  // Payments
  payments: {
    async getAll(branch = '') {
      const query = branch ? `?branch=${encodeURIComponent(branch)}` : '';
      const data = await apiRequest(`/payments${query}`);
      if (data && data.success && Array.isArray(data.payments) && data.payments.length > 0) {
        return data.payments;
      }
      return getStoredPayments();
    },

    async create(payment) {
      const data = await apiRequest('/payments', {
        method: 'POST',
        body: JSON.stringify(payment)
      });
      if (data && data.success && data.payment) return data.payment;
      return addStoredPayment(payment);
    },

    async delete(id) {
      await apiRequest(`/payments/${id}`, { method: 'DELETE' });
      return deletePayment(id);
    }
  },

  // Schools
  schools: {
    async getAll() {
      const data = await apiRequest('/schools');
      if (data && data.success && Array.isArray(data.schools) && data.schools.length > 0) {
        return data.schools;
      }
      return getStoredSchools();
    },

    async create(school) {
      const data = await apiRequest('/schools', {
        method: 'POST',
        body: JSON.stringify(school)
      });
      if (data && data.success && data.school) return data.school;
      return addStoredSchool(school);
    },

    async delete(id) {
      await apiRequest(`/schools/${id}`, { method: 'DELETE' });
      return deleteStoredSchool(id);
    }
  },

  // Batches
  batches: {
    async getAll(branch = '') {
      const query = branch ? `?branch=${encodeURIComponent(branch)}` : '';
      const data = await apiRequest(`/batches${query}`);
      if (data && data.success && Array.isArray(data.batches) && data.batches.length > 0) {
        return data.batches;
      }
      return getStoredBatches();
    },

    async create(batch) {
      const data = await apiRequest('/batches', {
        method: 'POST',
        body: JSON.stringify(batch)
      });
      if (data && data.success && data.batch) return data.batch;
      return addStoredBatch(batch);
    },

    async delete(id) {
      await apiRequest(`/batches/${id}`, { method: 'DELETE' });
      return deleteStoredBatch(id);
    }
  },

  // Certificates
  certificates: {
    async getAll(search = '') {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await apiRequest(`/certificates${query}`);
      if (data && data.success && Array.isArray(data.certificates)) {
        return data.certificates;
      }
      try {
        const stored = localStorage.getItem('bsel_certificates');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    },

    async issue(certificate) {
      const data = await apiRequest('/certificates', {
        method: 'POST',
        body: JSON.stringify(certificate)
      });
      if (data && data.success && data.certificate) return data.certificate;
      try {
        const stored = localStorage.getItem('bsel_certificates');
        const list = stored ? JSON.parse(stored) : [];
        const newCert = {
          id: Date.now(),
          certificate_no: `BSEL-CERT-${Date.now().toString().slice(-6)}`,
          ...certificate,
          issued_at: new Date().toISOString()
        };
        list.unshift(newCert);
        localStorage.setItem('bsel_certificates', JSON.stringify(list));
        return newCert;
      } catch {
        return certificate;
      }
    }
  }
};

export default api;
