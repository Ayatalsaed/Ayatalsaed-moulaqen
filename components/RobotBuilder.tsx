import React from 'react';
import { 
  Wifi, 
  Eye, 
  Activity, 
  Compass, 
  Video, 
  Cpu, 
  Zap, 
  Scale, 
  Save, 
  Box, 
  Disc
} from 'lucide-react';
import { RobotConfig, SensorType } from '../types';

interface RobotBuilderProps {
  config: RobotConfig;
  setConfig: (config: RobotConfig) => void;
  onSave: () => void;
}

const SENSORS: { id: SensorType; name: string; desc: string; icon: any; power: number; weight: number }[] = [
  { 
    id: 'ultrasonic', 
    name: 'حساس موجات فوق صوتية', 
    desc: 'لقياس المسافة وتجنب العقبات.', 
    icon: Wifi, 
    power: 5, 
    weight: 10 
  },
  { 
    id: 'infrared', 
    name: 'حساس تتبع الخط', 
    desc: 'للتعرف على الخطوط الأرضية (أسود/أبيض).', 
    icon: Activity, 
    power: 3, 
    weight: 5 
  },
  { 
    id: 'color', 
    name: 'حساس ألوان', 
    desc: 'للتعرف على ألوان الأجسام والأسطح.', 
    icon: Eye, 
    power: 4, 
    weight: 8 
  },
  { 
    id: 'gyro', 
    name: 'جيروسكوب', 
    desc: 'لتحديد الاتجاه وزوايا الدوران بدقة.', 
    icon: Compass, 
    power: 2, 
    weight: 5 
  },
  { 
    id: 'camera', 
    name: 'كاميرا AI', 
    desc: 'للتعرف على الأشكال والوجوه (متقدم).', 
    icon: Video, 
    power: 15, 
    weight: 25 
  }
];

const RobotBuilder: React.FC<RobotBuilderProps> = ({ config, setConfig, onSave }) => {
  
  const toggleSensor = (id: SensorType) => {
    const newSensors = config.sensors.includes(id)
      ? config.sensors.filter(s => s !== id)
      : [...config.sensors, id];
    setConfig({ ...config, sensors: newSensors });
  };

  // Calculate stats
  const totalPower = SENSORS.filter(s => config.sensors.includes(s.id)).reduce((acc, curr) => acc + curr.power, 20); // Base power 20
  const totalWeight = SENSORS.filter(s => config.sensors.includes(s.id)).reduce((acc, curr) => acc + curr.weight, 500); // Base weight 500g

  return (
    <div className="h-full p-4 lg:p-8 animate-fadeIn overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">ورشة بناء الروبوت</h2>
            <p className="text-slate-400">صمم الروبوت الخاص بك، اختر الهيكل والحساسات المناسبة للمهمة.</p>
          </div>
          <button 
            onClick={onSave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Save size={20} />
            <span>حفظ التكوين</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Robot Preview & Base Config */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Name & Type Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
               <div className="mb-4">
                 <label className="block text-slate-400 text-sm mb-2">اسم الروبوت</label>
                 <input 
                    type="text" 
                    value={config.name}
                    onChange={(e) => setConfig({...config, name: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-emerald-500 outline-none transition-colors"
                 />
               </div>

               <div>
                 <label className="block text-slate-400 text-sm mb-2">نوع الهيكل</label>
                 <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'rover', label: 'عربة', icon: Box },
                      { id: 'arm', label: 'ذراع', icon: Zap },
                      { id: 'drone', label: 'طائرة', icon: Disc },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setConfig({...config, type: type.id as any})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          config.type === type.id 
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <type.icon size={20} className="mb-1" />
                        <span className="text-xs">{type.label}</span>
                      </button>
                    ))}
                 </div>
               </div>
            </div>

            {/* Visual Preview (Abstract) */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 flex items-center justify-center relative min-h-[300px]">
               <div className="w-48 h-48 bg-slate-800 rounded-3xl border-2 border-slate-700 relative flex items-center justify-center shadow-2xl">
                  {/* Wheels */}
                  <div className="absolute -left-4 top-4 w-4 h-12 bg-slate-700 rounded-l-lg"></div>
                  <div className="absolute -left-4 bottom-4 w-4 h-12 bg-slate-700 rounded-l-lg"></div>
                  <div className="absolute -right-4 top-4 w-4 h-12 bg-slate-700 rounded-r-lg"></div>
                  <div className="absolute -right-4 bottom-4 w-4 h-12 bg-slate-700 rounded-r-lg"></div>
                  
                  {/* Body */}
                  <div className="text-slate-500 font-mono text-xs text-center">
                     <Cpu size={48} className="mx-auto mb-2 opacity-50" />
                     {config.name}
                  </div>

                  {/* Mounted Sensors Visualization */}
                  {config.sensors.includes('ultrasonic') && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500/20 border border-indigo-500 p-1.5 rounded-lg" title="Ultrasonic">
                      <Wifi size={16} className="text-indigo-400" />
                    </div>
                  )}
                  
                  {config.sensors.includes('infrared') && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                       <div className="bg-rose-500/20 border border-rose-500 p-1.5 rounded-lg">
                         <Activity size={16} className="text-rose-400" />
                       </div>
                    </div>
                  )}

                  {config.sensors.includes('color') && (
                    <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-amber-500/20 border border-amber-500 p-1.5 rounded-lg">
                      <Eye size={16} className="text-amber-400" />
                    </div>
                  )}
               </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">الطاقة</div>
                    <div className="font-bold text-slate-200">{totalPower} mAh</div>
                  </div>
               </div>
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Scale size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">الوزن</div>
                    <div className="font-bold text-slate-200">{totalWeight} g</div>
                  </div>
               </div>
            </div>

          </div>

          {/* Right Column: Sensor Selection */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="text-emerald-500" />
              إدارة الحساسات والمستشعرات
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SENSORS.map((sensor) => {
                const isSelected = config.sensors.includes(sensor.id);
                return (
                  <div 
                    key={sensor.id}
                    onClick={() => toggleSensor(sensor.id)}
                    className={`relative group cursor-pointer p-5 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-slate-800 border-emerald-500 shadow-lg shadow-emerald-900/20' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <sensor.icon size={24} />
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600 bg-transparent'
                      }`}>
                         {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    
                    <h4 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {sensor.name}
                    </h4>
                    <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                      {sensor.desc}
                    </p>

                    <div className="flex items-center gap-3 text-xs font-mono border-t border-slate-700/50 pt-3">
                      <span className="flex items-center gap-1 text-yellow-500/80">
                        <Zap size={12} /> {sensor.power}mA
                      </span>
                      <span className="flex items-center gap-1 text-blue-400/80">
                        <Scale size={12} /> {sensor.weight}g
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl flex items-start gap-3">
               <div className="mt-1 text-indigo-400"><Video size={20} /></div>
               <div>
                 <h4 className="font-bold text-indigo-200 text-sm">نصيحة المعلم الذكي</h4>
                 <p className="text-xs text-indigo-300/80 mt-1">
                   إضافة الكاميرا تستهلك طاقة عالية. إذا كانت مهمتك تعتمد فقط على تتبع الخط، فإن الحساسات تحت الحمراء (IR) أكثر كفاءة وتوفر استجابة أسرع.
                 </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotBuilder;
