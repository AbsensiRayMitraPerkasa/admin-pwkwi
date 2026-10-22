function getDashboardData(filter) {
  filter = filter || {};
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tz = Session.getScriptTimeZone();
  var mulai = filter.mulai ? new Date(filter.mulai + 'T00:00:00') : null;
  var selesai = filter.selesai ? new Date(filter.selesai + 'T23:59:59') : null;
  var namaFilter = String(filter.nama || '').trim().toUpperCase();

  function parseTanggal(value) {
    if (value instanceof Date && !isNaN(value)) return value;
    var p = String(value || '').replace(/'/g, '').trim().split(/[\/\-]/);
    if (p.length !== 3) return null;
    var d = new Date(parseInt(p[2], 10), parseInt(p[1], 10) - 1, parseInt(p[0], 10));
    return isNaN(d) ? null : d;
  }
  function cocok(nama, tanggal) {
    if (!tanggal || (mulai && tanggal < mulai) || (selesai && tanggal > selesai)) return false;
    return !namaFilter || String(nama).toUpperCase().indexOf(namaFilter) !== -1;
  }
  function jam(value) {
    return value instanceof Date ? Utilities.formatDate(value, tz, 'HH:mm:ss') : String(value || '').trim();
  }

  var absensi = [];
  var sh = ss.getSheetByName('Sheet1') || ss.getSheets()[0];
  if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, 13).getValues().forEach(function(r) {
      var nama = String(r[0] || '').trim(), t = parseTanggal(r[2]);
      if (!nama || !cocok(nama, t)) return;
      absensi.push({nama:nama, jenis:String(r[1] || '').trim().toUpperCase(), tanggal:Utilities.formatDate(t,tz,'yyyy-MM-dd'), tanggalTampil:Utilities.formatDate(t,tz,'dd MMM yyyy'), waktu:jam(r[3]), foto:String(r[4] || ''), kelurahan:String(r[8] || ''), kecamatan:String(r[9] || ''), kabupaten:String(r[10] || ''), maps:String(r[11] || '')});
    });
  }

  var patroli = [], sp = ss.getSheetByName('PATROLI');
  if (sp && sp.getLastRow() > 1) {
    sp.getRange(2, 1, sp.getLastRow() - 1, 12).getValues().forEach(function(r) {
      var nama = String(r[0] || '').trim(), t = parseTanggal(r[2]);
      if (!nama || !cocok(nama, t)) return;
      patroli.push({nama:nama, lokasi:String(r[1] || ''), tanggal:Utilities.formatDate(t,tz,'yyyy-MM-dd'), tanggalTampil:Utilities.formatDate(t,tz,'dd MMM yyyy'), waktu:jam(r[3]), foto:String(r[4] || ''), kelurahan:String(r[8] || ''), kecamatan:String(r[9] || ''), kabupaten:String(r[10] || ''), maps:String(r[11] || '')});
    });
  }
  function terbaru(a,b) { return (b.tanggal+' '+b.waktu).localeCompare(a.tanggal+' '+a.waktu); }
  absensi.sort(terbaru); patroli.sort(terbaru);
  var karyawan = {};
  absensi.concat(patroli).forEach(function(x) { karyawan[x.nama] = true; });
  var hariIni = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'), hadir = {};
  absensi.forEach(function(x) { if (x.tanggal === hariIni && x.jenis === 'DATANG') hadir[x.nama] = true; });
  return {absensi:absensi, patroli:patroli, karyawan:Object.keys(karyawan).sort(), ringkasan:{totalAbsensi:absensi.length, totalDatang:absensi.filter(function(x){return x.jenis==='DATANG';}).length, totalPulang:absensi.filter(function(x){return x.jenis==='PULANG';}).length, totalPatroli:patroli.length, hadirHariIni:Object.keys(hadir).length}};
}
