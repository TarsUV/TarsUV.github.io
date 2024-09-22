const { useState, useEffect } = React;
const { motion } = Motion;
const { Coffee, Settings, HelpCircle, Home, Clock, AlertTriangle, Wifi } = lucide;

function Dashboard() {
  const [grindLevel, setGrindLevel] = useState('medium');
  const [isGrinding, setIsGrinding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [weight, setWeight] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [beltSpeed, setBeltSpeed] = useState(50);
  const [motorSpeed, setMotorSpeed] = useState(50);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [beltEnabled, setBeltEnabled] = useState(true);
  const [motorEnabled, setMotorEnabled] = useState(true);
  const [wifiStatus, setWifiStatus] = useState('Conectado');
  const [wifiSignal, setWifiSignal] = useState(75);
  const [ipAddress, setIpAddress] = useState('192.168.1.100');

  useEffect(() => {
    switch (grindLevel) {
      case 'coarse':
        setTimeRemaining(15);
        break;
      case 'medium':
        setTimeRemaining(30);
        break;
      case 'fine':
        setTimeRemaining(45);
        break;
    }
  }, [grindLevel]);

  const startGrinding = () => {
    setIsGrinding(true);
    setProgress(0);
    setWeight(0);
    const totalTime = timeRemaining;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGrinding(false);
          return 100;
        }
        const newProgress = prev + (100 / totalTime / 10);
        setWeight((newProgress / 100) * 500); // Assuming max weight is 500g
        setTimeRemaining((time) => Math.max(0, totalTime - (newProgress / 100) * totalTime));
        return newProgress;
      });
    }, 100);
  };

  const sendToESP32 = () => {
    // Simulating sending data to ESP32
    console.log('Sending to ESP32:', {
      beltEnabled,
      motorEnabled,
      beltSpeed,
      motorSpeed
    });
    // In a real application, you would send this data to your ESP32 here
  };

  useEffect(() => {
    sendToESP32();
  }, [beltEnabled, motorEnabled, beltSpeed, motorSpeed]);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-cream-100 text-brown-900'}`}>
      {/* Navigation Bar */}
      <nav className="bg-brown-800 text-cream-100 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8" />
            <span className="text-xl font-bold">CoffeeGrind Pro</span>
          </div>
          <button className="btn btn-primary">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Grinding Control */}
          <div className="card col-span-full lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Control de Molienda</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nivel de Molienda
                </label>
                <div className="flex space-x-2">
                  <button
                    className={`btn ${grindLevel === 'coarse' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setGrindLevel('coarse')}
                  >
                    Grueso
                  </button>
                  <button
                    className={`btn ${grindLevel === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setGrindLevel('medium')}
                  >
                    Medio
                  </button>
                  <button
                    className={`btn ${grindLevel === 'fine' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setGrindLevel('fine')}
                  >
                    Fino
                  </button>
                </div>
              </div>
              <button
                className="btn btn-primary w-full"
                onClick={startGrinding}
                disabled={isGrinding}
              >
                {isGrinding ? 'Moliendo...' : 'Iniciar Molienda'}
              </button>
              <div className="text-center font-semibold">
                Estado: {isGrinding ? 'Moliendo' : 'Inactivo'}
              </div>
            </div>
          </div>

          {/* Real-time Visualization */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Visualización en Tiempo Real</h2>
            <div className="flex justify-center mb-4">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#D2B48C"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#8B4513"
                  strokeWidth="20"
                  strokeDasharray={`${2 * Math.PI * 90 * progress / 100} ${2 * Math.PI * 90}`}
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="100" textAnchor="middle" dy=".3em" fontSize="24" fill={isDarkMode ? "#fff" : "#000"}>
                  {Math.round(progress)}%
                </text>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-500">Peso Actual</div>
                <div className="text-xl font-semibold">{weight.toFixed(1)}g</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Tiempo Restante</div>
                <div className="text-xl font-semibold">{Math.ceil(timeRemaining)}s</div>
              </div>
            </div>
          </div>

          {/* Current Parameters */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Parámetros Actuales</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Velocidad de la Cinta:</span>
                <span className="font-semibold">{beltSpeed}%</span>
              </div>
              <div className="flex justify-between">
                <span>Velocidad del Motor:</span>
                <span className="font-semibold">{motorSpeed}%</span>
              </div>
              <div className="flex justify-between">
                <span>Nivel de Molienda:</span>
                <span className="font-semibold">{grindLevel}</span>
              </div>
            </div>
          </div>

          {/* Manual Controls */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Controles Manuales</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Cinta Transportadora</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={beltEnabled}
                    onChange={(e) => setBeltEnabled(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Motor de Molienda</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={motorEnabled}
                    onChange={(e) => setMotorEnabled(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div>
                <label htmlFor="belt-speed" className="block text-sm font-medium mb-1">
                  Velocidad de la Cinta (PWM)
                </label>
                <input
                  type="range"
                  id="belt-speed"
                  min="0"
                  max="100"
                  value={beltSpeed}
                  onChange={(e) => setBeltSpeed(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="motor-speed" className="block text-sm font-medium mb-1">
                  Velocidad del Motor (PWM)
                </label>
                <input
                  type="range"
                  id="motor-speed"
                  min="0"
                  max="100"
                  value={motorSpeed}
                  onChange={(e) => setMotorSpeed(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* WiFi Information */}
          <div className="card col-span-full md:col-span-1">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Wifi className="mr-2" />
              Información WiFi
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Estado:</span>
                <span className={`font-semibold ${wifiStatus === 'Conectado' ? 'text-green-500' : 'text-red-500'}`}>
                  {wifiStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Señal:</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-green-500 rounded-full h-2"
                      style={{ width: `${wifiSignal}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold">{wifiSignal}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Dirección IP:</span>
                <span className="font-semibold">{ipAddress}</span>
              </div>
            </div>
          </div>

          {/* Quick History */}
          <div className="card col-span-full md:col-span-1">
            <h2 className="text-xl font-bold mb-4">Historial Rápido</h2>
            <ul className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>Molienda #{i + 1}</span>
                  <span className="text-sm text-gray-500">Hace {i + 1}h</span>
                </li>
              ))}
            </ul>
          </div>

          {/* System Status */}
          <div className="card col-span-full md:col-span-1">
            <h2 className="text-xl font-bold mb-4">Estado del Sistema</h2>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Cinta Transportadora</span>
                <span className={beltEnabled ? "text-green-500" : "text-red-500"}>
                  {beltEnabled ? "Habilitada" : "Deshabilitada"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Motor de Molienda</span>
                <span className={motorEnabled ? "text-green-500" : "text-red-500"}>
                  {motorEnabled ? "Habilitado" : "Deshabilitado"}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Sensores</span>
                <span className="text-yellow-500">Verificando</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-brown-100'}`}>
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div>
            <a href="#" className="mr-4 hover:underline">Documentación</a>
            <a href="#" className="hover:underline">Soporte Técnico</a>
          </div>
          <div>Versión 1.0.0</div>
        </div>
      </footer>

      {/* Dark Mode Toggle */}
      <div className="fixed bottom-4 right-4">
        <label className="switch">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={(e) => setIsDarkMode(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
        <span className="ml-2 text-sm">
          Modo Oscuro
        </span>
      </div>

      {/* Notification */}
      {isGrinding && progress > 90 && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg flex items-center">
          <AlertTriangle className="mr-2" />
          <span>¡Molienda casi completa!</span>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<Dashboard />, document.getElementById('root'));
