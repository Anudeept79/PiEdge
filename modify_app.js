const fs = require('fs');
let code = fs.readFileSync('c:/Anudeep/PIEdge app/src/App.tsx', 'utf8');

// 1. Add showPushScriptModal state
if (!code.includes('const [showPushScriptModal')) {
    code = code.replace(
        /const \[showOtaModal.*?null\);/,
        "$&\\n  const [showPushScriptModal, setShowPushScriptModal] = useState<typeof INITIAL_RPIS[0] | null>(null);"
    );
}

// 2. Modify Push Script button onClick
code = code.replace(
    /onClick=\{\(\) => \{\s*addToast\('success',\s*Script pushed successfully to Data Logger: \$\{rpi\.mac\}\);\s*\}\}/,
    "onClick={() => { setShowPushScriptModal(rpi); }}"
);

// 3. Update OTA Modal to have Version + URL (remove schedule and release notes)
const oldOtaModal = \              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-slate-500">Deployment Schedule</span>
                <div className="flex flex-col gap-1.5 text-xs text-slate-500 pl-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="deploy_sched" defaultChecked className="accent-[#2563EB]" />
                    <span>Immediate (Triggers push in 300ms)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="deploy_sched" className="accent-[#2563EB]" />
                    <span>Next maintenance window (02:00–04:00 AM)</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1 bg-slate-50 p-3 rounded border border-slate-100 text-xs font-medium text-slate-500">
                <span className="text-[#2563EB] font-bold uppercase text-xs mb-1">Release Notes (v3.1)</span>
                <span>- Optimized BLE continuous scans</span>
                <span>- Fixed MQTT broker memory leaks</span>
                <span>- Autopair firmware modules for NRF52</span>
              </div>\;

const newOtaModalURL = \              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-slate-500">Update Script/Firmware URL</span>
                <input 
                  type="url"
                  id="target_ota_url"
                  placeholder="https://repo.warepro.local/firmware/v3.1.bin"
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 p-2.5 outline-none focus:border-[#3B82F6]"
                />
              </label>\;

code = code.replace(oldOtaModal, newOtaModalURL);

// 4. Inject showPushScriptModal JSX right after showOtaModal block
const pushScriptModalBlock = \      {/* 4b. Push Script Modal */}
      {showPushScriptModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] overlay-fade-in flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowPushScriptModal(null); }}>
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl z-[1000] overflow-hidden modal-enter text-left">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#2563EB] font-bold flex items-center gap-1"><Upload className="w-3.5 h-3.5" /> Push Script to Data Logger</span>
              <button onClick={() => setShowPushScriptModal(null)} className="text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="p-3.5 bg-white border border-slate-100 rounded-lg flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-400">TARGET DATA LOGGER</span>
                <span className="text-xs font-bold text-slate-900">{showPushScriptModal.mac} · Data Logger Node · {showPushScriptModal.status}</span>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-slate-500">Update Script URL</span>
                <input 
                  type="url"
                  id="target_script_url"
                  placeholder="https://repo.warepro.local/scripts/update.sh"
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 p-2.5 outline-none focus:border-[#3B82F6]"
                />
              </label>

              <div className="flex gap-3 justify-end border-t border-slate-100 pt-4 mt-2">
                <button 
                  onClick={() => setShowPushScriptModal(null)} 
                  className="px-4 py-2 border border-slate-200 text-xs font-medium text-slate-500 rounded-lg transition-base hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const urlEl = document.getElementById("target_script_url");
                    const url = urlEl ? urlEl.value : "";
                    if (!url) {
                      addToast('warning', 'Please enter a valid Script URL');
                      return;
                    }
                    addToast('success', \Script (\) pushed successfully to Data Logger: \\);
                    setShowPushScriptModal(null);
                  }}
                  className="btn-primary btn-lg"
                >
                  Push Script <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}\\n\\n\;

if (!code.includes('{/* 4b. Push Script Modal */}')) {
    code = code.replace(/\{\/\* 5\. Register Sensor Right Drawer \*\/\}/, pushScriptModalBlock + "      {/* 5. Register Sensor Right Drawer */}");
}


// 5. Update Sensor Registration Form Drag-and-drop to Routing URL
const oldDragAndDrop = \<span className="section-header">-- FIRMWARE BINARY --</span>
                
                {/* Drag and Drop Zone */}
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-base cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-sans text-slate-500">Drop compiled binary (.bin) here</span>
                  <span className="text-xs font-medium text-slate-400 mt-1">Maximum file size 16MB</span>
                </div>\;

const newRoutingUrl = \<span className="section-header">-- ROUTING --</span>
                
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500 uppercase">Specific Routing URL *</span>
                  <input 
                    type="url" 
                    id="reg_sensor_url"
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-sans text-slate-900 focus:border-[#3B82F6] outline-none"
                    placeholder="https://api.warepro.local/sensors/ingest" 
                  />
                </label>\;

code = code.replace(oldDragAndDrop, newRoutingUrl);


fs.writeFileSync('c:/Anudeep/PIEdge app/src/App.tsx', code);
console.log('App modifications completed.');
