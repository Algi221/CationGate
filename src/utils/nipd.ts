export const getMajorOrderScore = (major: string) => {
  if (!major) return 99;
  const m = major.toLowerCase();
  if (m.includes("te") || m.includes("elektronika")) return 1;
  if (m.includes("rpl") || m.includes("rekayasa") || m.includes("perangkat")) return 2;
  if (m.includes("tkj") || m.includes("tjkt") || m.includes("jaringan") || m.includes("komputer")) return 3;
  if (m.includes("pspt") || m.includes("bc") || m.includes("broadcasting") || m.includes("perfilman")) return 4;
  if (m.includes("dkv") || m.includes("visual") || m.includes("desain")) return 5;
  if (m.includes("animasi") || m.includes("anm")) return 6;
  return 99;
};

export const generateNipdMap = (applicants: any[]) => {
  // Only process approved/active students for NIPD
  const activeStudents = applicants.filter(a => a.status === 'Approved');

  // Sort by Major Order, then Alphabetically by Name
  const sortedStudents = [...activeStudents].sort((a, b) => {
    const m1 = getMajorOrderScore(a.jurusan || a.jurusan_1 || a.jurusan1 || "");
    const m2 = getMajorOrderScore(b.jurusan || b.jurusan_1 || b.jurusan1 || "");
    
    if (m1 !== m2) return m1 - m2;
    
    return (a.nama || "").localeCompare(b.nama || "");
  });

  const nipdMap = new Map<number, string>();
  
  sortedStudents.forEach((student, index) => {
    const sequenceNumber = index + 1;
    // Format sequence to 3 digits minimum
    const paddedSequence = sequenceNumber.toString().padStart(3, "0");
    
    // Get year prefix from periode (e.g., 2026-2027 -> 2627)
    let yearPrefix = "2627";
    try {
      if (student.periode) {
        const parts = student.periode.split("-");
        const year1 = parts[0].slice(-2);
        const year2 = parts[1].slice(-2);
        yearPrefix = `${year1}${year2}`;
      }
    } catch (e) {
      // fallback
    }

    // Format: [YY][YY]100[SEQ]
    // Example: 2627100042
    nipdMap.set(student.id, `${yearPrefix}100${paddedSequence}`);
  });

  return nipdMap;
};
