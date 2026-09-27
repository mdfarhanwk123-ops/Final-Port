import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* ---------- META (About / Contact / Photo / Resume) ---------- */
const META_DOC = doc(db, "portfolio", "meta");

export async function getPortfolioMeta() {
  const snap = await getDoc(META_DOC);
  return snap.exists() ? snap.data() : null;
}

export async function savePortfolioMeta(data) {
  await setDoc(META_DOC, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

/* ---------- RESUME / CV (Base64 in Firestore) ---------- */

export async function uploadResumeAsBase64(file) {
  if (!file) throw new Error("No file selected");

  // Firestore doc limit is 1 MiB. Base64 adds ~33% overhead.
  // Cap at 700 KB so we stay safely under the limit.
  const MAX_BYTES = 700 * 1024;
  if (file.size > MAX_BYTES) {
    throw new Error(
      `File is ${(file.size / 1024).toFixed(0)} KB. Max is 700 KB. ` +
      `Compress your PDF (smallpdf.com/compress-pdf) and try again.`
    );
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  await savePortfolioMeta({
    resumeUrl: dataUrl,
    resumeName: file.name,
    resumeType: file.type || "application/pdf",
    resumeSize: file.size,
  });

  return dataUrl;
}

export async function deleteResume() {
  await savePortfolioMeta({
    resumeUrl: "",
    resumeName: "",
    resumeType: "",
    resumeSize: 0,
  });
}

/* ---------- SKILLS ---------- */
const SKILLS_COL = collection(db, "skills");

export async function getSkills() {
  const snap = await getDocs(SKILLS_COL);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function addSkill(skill) {
  return addDoc(SKILLS_COL, { ...skill, createdAt: serverTimestamp() });
}

export async function updateSkill(id, skill) {
  if (!id) throw new Error("Missing skill id");
  return updateDoc(doc(db, "skills", id), skill);
}

export async function deleteSkill(id) {
  if (!id) throw new Error("Missing skill id");
  return deleteDoc(doc(db, "skills", id));
}

/* ---------- SOFTWARE ---------- */
const SOFTWARE_COL = collection(db, "software");

export async function getSoftware() {
  const snap = await getDocs(SOFTWARE_COL);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function addSoftware(item) {
  return addDoc(SOFTWARE_COL, { ...item, createdAt: serverTimestamp() });
}

export async function updateSoftware(id, item) {
  if (!id) throw new Error("Missing id");
  return updateDoc(doc(db, "software", id), item);
}

export async function deleteSoftware(id) {
  if (!id) throw new Error("Missing id");
  return deleteDoc(doc(db, "software", id));
}

/* ---------- EXPERIENCE ---------- */
const EXPERIENCE_COL = collection(db, "experience");

export async function getExperience() {
  const snap = await getDocs(EXPERIENCE_COL);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function addExperience(item) {
  return addDoc(EXPERIENCE_COL, { ...item, createdAt: serverTimestamp() });
}

export async function updateExperience(id, item) {
  if (!id) throw new Error("Missing id");
  return updateDoc(doc(db, "experience", id), item);
}

export async function deleteExperience(id) {
  if (!id) throw new Error("Missing id");
  return deleteDoc(doc(db, "experience", id));
}

/* ---------- PROJECTS ---------- */
const PROJECTS_COL = collection(db, "projects");

export async function getProjects() {
  const snap = await getDocs(PROJECTS_COL);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function addProject(project) {
  return addDoc(PROJECTS_COL, { ...project, createdAt: serverTimestamp() });
}

export async function updateProject(id, project) {
  if (!id) throw new Error("Missing id");
  return updateDoc(doc(db, "projects", id), project);
}

export async function deleteProject(id) {
  if (!id) throw new Error("Missing id");
  return deleteDoc(doc(db, "projects", id));
}

/* ---------- CERTIFICATES ---------- */
const CERTS_COL = collection(db, "certificates");

export async function getCertificates() {
  const snap = await getDocs(CERTS_COL);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function addCertificate(cert) {
  return addDoc(CERTS_COL, { ...cert, createdAt: serverTimestamp() });
}

export async function updateCertificate(id, cert) {
  if (!id) throw new Error("Missing id");
  return updateDoc(doc(db, "certificates", id), cert);
}

export async function deleteCertificate(id) {
  if (!id) throw new Error("Missing id");
  return deleteDoc(doc(db, "certificates", id));
}