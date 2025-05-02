import React, { useState, useEffect, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { MeshStandardMaterial } from 'three';
import { FaCode, FaFlag, FaFont, FaTrashAlt, FaExclamationTriangle, FaSatelliteDish, FaArrowsAlt, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { AppBar, Toolbar, Typography, Tooltip } from "@mui/material";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import RC from './assets/img/RC.png';
import LC from './assets/img/LC.png';
import SCROLL from './assets/img/SCROLL.png';
import Icon from './assets/img/icon.png';

// Estilos para botones del menú contextual
const buttonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: "5px 10px",
  fontSize: "16px",
  color: "white",
};

/**
 * @param {onClick} param0 Función que se ejecuta al hacer clic en el modelo 
 * @returns Modelo 3D Principal
 * @description Este componente utiliza la librería GLTF para cargar un modelo 3D y lo presenta en la pantalla.
 * El modelo se puede hacer clic para interactuar con él.
 * @example <Model onClick={handleClick} />
 */
function Model({ onClick }) {
  const { scene } = useGLTF("/modelos/modular_pipes.glb");
  return <primitive object={scene} scale={0.5} onClick={onClick} />;
}

/**
 * @param {position, onPointerOver, onPointerOut, onContextMenu} param0 Funciones que manejan eventos de puntero y posición de la bandera
 * @returns Modelo de esfera que representa una bandera
 * @description Este componente representa una bandera en el modelo 3D.
 * Se puede hacer clic en la bandera para interactuar con ella.
 * También se pueden manejar eventos de puntero para mostrar información adicional.
 * @example <Flag position={[x, y, z]} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onContextMenu={handleContextMenu} />
 */
function Flag({ position, onPointerOver, onPointerOut, onContextMenu }) {
  return (
    <mesh position={position} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onContextMenu={onContextMenu}>
      <sphereGeometry args={[0.04, 5, 5]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}

/**
 * @param {position, onPointerOver, onPointerOut, onContextMenu} param0 Funciones que manejan eventos de puntero y posición de la bandera
 * @returns Modelo de esfera que representa una zona de alerta
 * @description Este componente representa una bandera en el modelo 3D.
 * Se puede hacer clic en el icono de alerta para interactuar con este.
 * También se pueden manejar eventos de puntero para mostrar información adicional.
 * @example <Flag2 position={[x, y, z]} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onContextMenu={handleContextMenu} />
 */
function Flag2({ position, onPointerOver, onPointerOut, onContextMenu }) {
  return (
    <mesh position={position} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onContextMenu={onContextMenu}>
      <sphereGeometry args={[0.04, 5, 5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

/**
 * @param {position, onPointerOver, onPointerOut, onContextMenu} param0 Funciones que manejan eventos de puntero y posición de la bandera
 * @returns Modelo de esfera que representa un objeto 3D
 * @description Este componente representa una bandera en el modelo 3D.
 * Se puede hacer clic en el modelo para interactuar con este.
 * También se pueden manejar eventos de puntero para mostrar información adicional.
 * @example <Sensor position={[x, y, z]} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onContextMenu={handleContextMenu} />
 */
function Sensor({ position, onPointerOver, onPointerOut, onContextMenu, rotation }) {
  const obj = useLoader(OBJLoader, '/modelos/POS.obj'); // la ruta es relativa a /public

  const sensorModel = useMemo(() => {
    const clone = obj.clone();
    clone.scale.set(0.01, 0.01, 0.01); // Reducir tamaño al 10%
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({ color: 'blue' });
      }
    });
    return clone;
  }, [obj, rotation]);

  return (
    <primitive
      object={sensorModel}
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onContextMenu={onContextMenu}
      rotation={[rotation.x, rotation.y, rotation.z]}
    />
  );
}

/**
 * @param {position, message} param0 Datas para el tooltip
 * @returns Componente Tooltip
 * @description Este componente representa un tooltip que se muestra al pasar el mouse sobre una bandera.
 * El tooltip muestra información adicional sobre la bandera.
 * @example <Tooltip position={tooltipPosition} message="Mensaje" />
 */
function TooltipM({ position, message }) {
  const tooltipWidth = 200; // Asumiendo ancho aproximado
  const tooltipHeight = 30; // Asumiendo alto aproximado
  const tooltipX = position.x - tooltipWidth / 2;
  const tooltipY = position.y - 50;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: `${tooltipY}px`,
          left: `${tooltipX}px`,
          width: `${tooltipWidth}px`,
          height: `${tooltipHeight}px`,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "5px",
          borderRadius: "3px",
          pointerEvents: "none",
          textAlign: "center",
        }}
      >
        {message}
      </div>
    </>
  );
}

export default function App() {
  
  //VARIABLES DE ESTADO
  const [flagMode, setFlagMode] = useState(false);
  const [flagMode2, setFlagMode2] = useState(false);
  const [sensor,set_sensor] = useState(false);
  const [showPositionMenu, setShowPositionMenu] = useState(false);
  const [showSensorMenu, setShowSensorMenu] = useState(false);
  const [flags, setFlags] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedFlagId, setSelectedFlagId] = useState(null);
  const [selectedTooltipText, setSelectedTooltipText] = useState(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [lastRotation, setLastRotation] = useState(null);

  /**
   * @param {*} event Evento de clic
   * @description Maneja el evento de clic en el modelo 3D.
   * Si el modo de bandera está activado, se agrega una nueva bandera en la posición del clic.
   * Si no, se desactiva el modo de bandera y se restablece el cursor.
   */
  const handleClick = (event) => {
    if (flagMode && event.intersections.length > 0) {
      setFlagMode(false);
      document.body.style.cursor = "default";
      const { point } = event.intersections[0];
      setFlags([...flags, { id: Date.now(), position: [point.x, point.y, point.z], tooltipText: "NO DATA", family: 1, rotation: { x: 0, y: 0, z: 0 } }]);
    }
    if (flagMode2 && event.intersections.length > 0) {
      setFlagMode2(false);
      document.body.style.cursor = "default";
      const { point } = event.intersections[0];
      setFlags([...flags, { id: Date.now(), position: [point.x, point.y, point.z], tooltipText: "NO DATA", family: 2, rotation: { x: 0, y: 0, z: 0 } }]);
    }
    if (sensor && event.intersections.length > 0) {
      set_sensor(false);
      document.body.style.cursor = "default";
      const { point } = event.intersections[0];
      setFlags([...flags, { id: Date.now(), position: [point.x, point.y, point.z], tooltipText: "NO DATA", family: 3, rotation: { x: 0, y: 0, z: 0 } }]);
    }
  };

  /**
   * @description Maneja el evento de clic en la bandera.
   * Activa el modo de bandera y cambia el cursor a una imagen personalizada.
   */
  const handleFlagClick = () => {
    setFlagMode(true);
    document.body.style.cursor =
      "url('data:image/svg+xml;utf8,<svg xmlns=\\\"http://www.w3.org/2000/svg\\\" viewBox=\\\"0 0 24 24\\\"><path fill=\\\"yellow\\\" d=\\\"M6 2v20h2V14h5l2 2h5V4h-5l-2-2H6z\\\"/></svg>') 0 24, auto";
  };

  /**
   * @description Maneja el evento de clic en la bandera de alerta.
   * Activa el modo de bandera de alerta y cambia el cursor a una imagen personalizada.
   */
  const handleFlagClick2 = () => {
    setFlagMode2(true);
    document.body.style.cursor =
      "url('data:image/svg+xml;utf8," +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
        '<polygon points="32,4 2,60 62,60" fill="red"/>' + // Triángulo
        '<rect x="29" y="20" width="6" height="20" fill="white"/>' + // Línea vertical del "!"
        '<circle cx="32" cy="48" r="4" fill="white"/>' + // Circulito
      "</svg>') 16 32, auto";
  };

  /**
   * @description Maneja el evento de clic en el sensor.
   * Activa el modo de sensor y cambia el cursor a una imagen personalizada.
   */
  const handleSensorClick = () => {
    set_sensor(true);
    document.body.style.cursor =
      "url('data:image/svg+xml;utf8," +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
      '<path fill="yellow" d="M256 32c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zm0 432c-17.673 0-32 14.327-32 32h64c0-17.673-14.327-32-32-32zm0-384c-124.617 0-224 99.383-224 224h48c0-97.047 78.953-176 176-176s176 78.953 176 176h48c0-124.617-99.383-224-224-224zm0 160c-35.346 0-64 28.654-64 64h128c0-35.346-28.654-64-64-64z"/>' +
      "</svg>') 16 32, auto";
  };

  /**
   * @param {*} event Maneja el evento de puntero sobre la bandera
   * @description Muestra el tooltip al pasar el mouse sobre la bandera.
   */
  const handlePointerOver = (event, flagId) => {
    const { clientX, clientY } = event;
    setTooltip({ x: clientX, y: clientY });
    flags.forEach(flag => {
      if (flag.id === flagId) {
        setSelectedTooltipText(flag.tooltipText);
      }
    })
  };

  /**
   * @description Oculta el tooltip al salir el mouse de la bandera.
   */
  const handlePointerOut = () => {
    setTooltip(null);
  };

  /**
   * @param {*} event Maneja el evento de clic derecho sobre la bandera
   * @param {Int} flagId Id de la bandera seleccionada
   * @description Muestra el menú contextual al hacer clic derecho sobre la bandera.
   */
  const handleContextMenu = (event, flagId) => {
    event.nativeEvent.preventDefault(); // Usar nativeEvent para prevenir el menú predeterminado
    setSelectedFlagId(flagId); // Almacenar el id de la bandera seleccionada
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  /**
   * @param {String} action Accion seleccionada en el menú contextual
   * @description Maneja las acciones del menú contextual.
   * En este caso, solo se implementa la acción de eliminar la bandera.
   * Se puede extender para incluir más acciones en el futuro.
   */
  const handleMenuAction = (action) => {
    switch (action) {
      
      case "edit":
        const newTooltipText = prompt("Ingrese el nuevo texto para la bandera:");
        flags.forEach(flag => {
          if (flag.id === selectedFlagId) {
            flag.tooltipText = newTooltipText; // Mueve la bandera un poco hacia arriba
          }
        })
        setFlags([...flags]);
        setSelectedFlagId(null); // Limpiar la id seleccionada
        break;

      case "move":
        setShowPositionMenu(true);
        flags.forEach(flag => {
          if (flag.id === selectedFlagId) {
            setLastPosition(flag.position);
            setLastRotation(flag.rotation);
            if (flag.family === 3) {
              setShowSensorMenu(true);
            }
            if (flag.family === 1 || flag.family === 2) {
              setShowSensorMenu(false);
            }
          }
        })
        break;

      case "delete":
        setFlags(flags.filter(flag => flag.id !== selectedFlagId));
        setSelectedFlagId(null); // Limpiar la id seleccionada
        break;

      default:
        break;
    }
    setContextMenu(null); // Cerrar el menú después de hacer una acción
  };

  useEffect(() => {
    // Bloquea el scroll al montar el componente
    document.body.style.overflow = "hidden";
  
    // Restaura el scroll al desmontar el componente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest(".context-menu")) {
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  /**
   * 
   * @param {String} direction Direccion en la que se moverá la bandera
   * @description Mueve la bandera seleccionada en la dirección especificada.
   * Las direcciones disponibles son: 'up', 'down', 'left', 'right', 'forward', 'backward'.
   * Cada dirección mueve la bandera un poco en la dirección correspondiente.
   * @example moveFlag('up') // Mueve la bandera hacia arriba
   */
  const moveFlag = (direction) => {
    flags.forEach(flag => {
      if (flag.id === selectedFlagId) {
        if (direction === 'up') {
          flag.position = [flag.position[0], flag.position[1]+0.01, flag.position[2]]; // Mueve la bandera un poco hacia arriba
        }
        if (direction === 'down') {
          flag.position = [flag.position[0], flag.position[1]-0.01, flag.position[2]]; // Mueve la bandera un poco hacia abajo
        }
        if (direction === 'left') {
          flag.position = [flag.position[0]-0.01, flag.position[1], flag.position[2]]; // Mueve la bandera un poco hacia la izquierda
        }
        if (direction === 'right') {
          flag.position = [flag.position[0]+0.01, flag.position[1], flag.position[2]]; // Mueve la bandera un poco hacia la derecha
        }
        if (direction === 'forward') {
          flag.position = [flag.position[0], flag.position[1], flag.position[2]+0.01]; // Mueve la bandera un poco hacia adelante
        }
        if (direction === 'backward') {
          flag.position = [flag.position[0], flag.position[1], flag.position[2]-0.01]; // Mueve la bandera un poco hacia atrás
        }
      }
    })
    setFlags([...flags]);
  }

  /**
   * @description Rota la bandera seleccionada en el eje especificado (x, y, z) en la dirección especificada (up, down).
   * @param {String} axis Eje al que se rotará la bandera (x, y, z)
   * @param {String} direction Direccion en la que se rotará la bandera (up, down)
   * @example rotateSnesor('x', 'up') // Rota la bandera un poco hacia arriba en el eje X
   */
  const rotateSnesor = (axis, direction) => {
    flags.forEach(flag => {
      if (flag.id === selectedFlagId) {
        if (axis === 'x') {
          if (direction === 'up') {
            flag.rotation.x = flag.rotation.x+0.1; // Rota la bandera un poco hacia arriba
          }
          if (direction === 'down') {
            flag.rotation.x = flag.rotation.x-0.1; // Rota la bandera un poco hacia abajo
          }
        }
        if (axis === 'y') {
          if (direction === 'up') {
            flag.rotation.y = flag.rotation.y+0.1; // Rota la bandera un poco hacia la izquierda
          }
          if (direction === 'down') {
            flag.rotation.y = flag.rotation.y-0.1; // Rota la bandera un poco hacia la derecha
          }
        }
        if (axis === 'z') {
          if (direction === 'up') {
            flag.rotation.z = flag.rotation.z+0.1; // Rota la bandera un poco hacia adelante
          }
          if (direction === 'down') {
            flag.rotation.z = flag.rotation.z-0.1; // Rota la bandera un poco hacia atrás
          }
        }
      }
    })
    setFlags([...flags]);
  }

  /**
   * @description Termina el posicionamiento de la bandera y cierra el menú de posición.
   * También se asegura de que el menú de sensor esté cerrado.
   * Si la bandera es un sensor, se cierra el menú de sensor.
   */
  const terminar_posicionamiento = () => {
    setShowPositionMenu(false);
    setShowSensorMenu(false);
    setSelectedFlagId(null);
  }

  /**
   * @description Cancela el posicionamiento de la bandera y restaura su posición original.
   * También cierra el menú de posición y el menú de sensor.
   * Si la bandera es un sensor, se cierra el menú de sensor.
   * Restaura la posición original de la bandera.
   */
  const cancelar_posicionamiento = () => {
    flags.forEach(flag => {
      if (flag.id === selectedFlagId) {
        flag.position = lastPosition; // Restaura la posición original
        flag.rotation = lastRotation; // Restaura la rotación original
      }
    })
    setFlags([...flags]);
    terminar_posicionamiento()
  }

  const handleJsonClick = () => {
    guardarJSONConSelector(flags)
  }

  async function guardarJSONConSelector(data) {
    try {
        const options = {
            types: [{
                description: "Archivo JSON",
                accept: { "application/json": [".json"] },
            }],
            suggestedName: "archivo.json"
        };

        const handle = await window.showSaveFilePicker(options);
        const writable = await handle.createWritable();

        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();

        console.log("Archivo guardado correctamente.");
    } catch (error) {
        console.error("Error al guardar el archivo:", error);
    }
  }

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", display: "flex", flexDirection: "column" }}>
      
      {/* ✅ Barra de navegación superior ====================================== */}
      <AppBar position="static">
        <Toolbar>
          <img src={Icon} alt="3dItemIcon" style={{ width: 30, height: 30, marginRight: 8 }} />
          <Typography variant="h6" component="div">
            Visor 3D de Tuberías
          </Typography>
        </Toolbar>
      </AppBar>
      {/* ✅ Barra de navegación superior ====================================== */}

      {/**Instrucciones de manejo 3d =========================================== */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "300px", height: "100px", backgroundColor: "rgba(128, 128, 128, 0.5)", display: "flex", justifyContent: "space-around", alignItems: "center", borderRadius: "10px", padding: "10px", color: "white" }}>
        <div style={{ textAlign: "center" }}>
          <img src={LC} alt="LC" style={{ width: "30px" }} />
          <Typography fontSize={12} fontWeight="bold">Rotar</Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <img src={SCROLL} alt="SCROLL" style={{ width: "30px" }} />
          <Typography fontSize={12} fontWeight="bold">Zoom</Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <img src={RC} alt="RC" style={{ width: "30px" }} />
          <Typography fontSize={12} fontWeight="bold">Dragg</Typography>
        </div>
      </div>
      {/**Instrucciones de manejo 3d =========================================== */}

      {/* Contenedor principal debajo del AppBar =============================== */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* Barra lateral ====================================================== */}
        <div style={{ width: "60px", background: "#333", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0" }}>
          <Tooltip
            title={
              <div>
                <Typography fontWeight="bold" fontSize={15}>
                  Marcador:
                </Typography>
                <Typography fontSize={12}>
                  Añade un marcador sobre la figura en donde tú quieras. Puedes eliminarlos y añadirles texto haciendo click derecho sobre ellos.
                </Typography>
              </div>
            }
            arrow
            placement="top"
          >
            <button
              onClick={handleFlagClick}
              style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: "24px", marginBottom: "10px" }}
            >
              <FaFlag />
            </button>
          </Tooltip>

          {/* Botón de alerta */}
          <Tooltip
            title={
              <div>
                <Typography fontWeight="bold" fontSize={15}>
                  Alerta:
                </Typography>
                <Typography fontSize={12}>
                  Usa esta opción para señalar un punto crítico o llamar la atención en la figura.
                </Typography>
              </div>
            }
            arrow
            placement="top"
          >
            <button onClick={handleFlagClick2}
              style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: "24px" }}
            >
              <FaExclamationTriangle />
            </button>
          </Tooltip>

          {/* Botón de sensor */}
          <Tooltip
            title={
              <div>
                <Typography fontWeight="bold" fontSize={15}>
                  Sensor:
                </Typography>
                <Typography fontSize={12}>
                  Añade un sensor a la figura para marcar zonas de monitoreo o medición. Este modelo es cambiable por cualquier modelo 3d.
                </Typography>
              </div>
            }
            arrow
            placement="top"
          >
            <button
              onClick={handleSensorClick}
              style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: "24px", marginTop: "15px" }}
            >
              <FaSatelliteDish />
            </button>
          </Tooltip>

          {/**Boton JSON */}
          <Tooltip
            title={
              <div>
                <Typography fontWeight="bold" fontSize={15}>
                  JSON:
                </Typography>
                <Typography fontSize={12}>
                  Visualiza o exporta los datos en formato JSON relacionados con esta figura.
                </Typography>
              </div>
            }
            arrow
            placement="top"
          >
            <button
              onClick={handleJsonClick}
              style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: "24px", marginTop: "15px" }}
            >
              <FaCode />
            </button>
          </Tooltip>

        </div>
        {/* Barra lateral ====================================================== */}
        
        <div style={{ flex: 1, position: "relative" }}>

          {/* Canvas 3D ======================================================= */}
          <Canvas camera={{ position: [0, 2, 5], fov: 50 }} onPointerMissed={() => setFlagMode(false)}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Model onClick={handleClick} />
            {flags.map((flag) => (
              flag.family === 1 ? (
                <Flag
                  key={flag.id}
                  position={flag.position}
                  rotation={flag.rotation || { x: 0, y: 0, z: 0 }}
                  onPointerOver={(event) => handlePointerOver(event, flag.id)}
                  onPointerOut={handlePointerOut}
                  onContextMenu={(event) => handleContextMenu(event, flag.id, flag.family)}
                />
              ) : flag.family === 2 ? (
                <Flag2
                  key={flag.id}
                  position={flag.position}
                  rotation={flag.rotation || { x: 0, y: 0, z: 0 }}
                  onPointerOver={(event) => handlePointerOver(event, flag.id)}
                  onPointerOut={handlePointerOut}
                  onContextMenu={(event) => handleContextMenu(event, flag.id, flag.family)}
                />
              ) : flag.family === 3 ? (
                <Sensor
                  key={flag.id}
                  position={flag.position}
                  rotation={flag.rotation || { x: 0, y: 0, z: 0 }}
                  onPointerOver={(event) => handlePointerOver(event, flag.id)}
                  onPointerOut={handlePointerOut}
                  onContextMenu={(event) => handleContextMenu(event, flag.id)}
                />
              ) : null // opcional: si no es 1 ni 2, no renderiza nada
            ))}
            <OrbitControls />
          </Canvas>
          {/* Canvas 3D ======================================================= */}

          {/* Tooltip ========================================================= */}
          {tooltip && (
            <TooltipM position={tooltip} message={selectedTooltipText || "NO DATA"} />
          )}
          {/* Tooltip ========================================================= */}

          {/**Menu Control Posicional ========================================= */}
          {showPositionMenu ? (
            <div style={{ position: "absolute", top: "20px", right: "20px", backgroundColor: "#333", color: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              
              {/* Panel de flechas direccionales (disposición en cruz) */}
              <div style={{ display: "grid", gridTemplateColumns: "auto", gridTemplateRows: "auto auto auto auto auto", gap: "5px", justifyItems: "center", alignItems: "center" }}>
                {/* Flechas direccionales */}
                <FaArrowUp style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => moveFlag('up')} />
                <div />
                <div style={{ display: "flex", gap: "5px" }}>
                  <FaArrowLeft style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => moveFlag('left')} />
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid white" }} />
                  <FaArrowRight style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => moveFlag('right')} />
                </div>
                <div />
                <FaArrowDown style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => moveFlag('down')} />
                {/* Flechas para el eje Z */}
                <div style={{ display: "flex", gap: "5px" }}>
                  <FaArrowCircleUp style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => moveFlag('forward')} />
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid white" }} />
                  <FaArrowCircleDown style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => moveFlag('backward')} />
                </div>
              </div>

              {showSensorMenu ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Eje Z */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span>Eje Z</span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <FaArrowLeft style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => rotateSnesor('z','up')} />
                      <FaArrowRight style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => rotateSnesor('z','down')} />
                    </div>
                  </div>

                  {/* Eje X */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span>Eje X</span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <FaArrowLeft style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => rotateSnesor('x','up')} />
                      <FaArrowRight style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => rotateSnesor('x','down')} />
                    </div>
                  </div>

                  {/* Eje Y */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span>Eje Y</span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <FaArrowLeft style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => rotateSnesor('y','up')} />
                      <FaArrowRight style={{ cursor: "pointer", fontSize: "24px" }} onClick={() => rotateSnesor('y','down')} />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Botón Aceptar */}
              <button onClick={() => terminar_posicionamiento()} style={{ width: "100%", padding: "10px", backgroundColor: "black", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px", marginTop: "10px" }}>
                Aceptar
              </button>
              <button onClick={() => cancelar_posicionamiento()} style={{ width: "100%", padding: "10px", backgroundColor: "black", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px",  marginTop: "10px" }}>
                Cancelar
              </button>
            </div>
          ) : null}
          {/**Menu Control Posicional ========================================= */}

          {/* Menú contextual ================================================= */}
          {contextMenu && (
            <div
              className="context-menu"
              style={{
                position: "absolute",
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`,
                backgroundColor: "#333",
                color: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                padding: "10px",
                borderRadius: "5px",
                zIndex: 10,
              }}
            >
              <button onClick={() => handleMenuAction("edit")} style={buttonStyle}>
                <FaFont style={{ marginRight: "8px" }} />
                Editar
              </button>

              <button onClick={() => handleMenuAction("move")} style={buttonStyle}>
                <FaArrowsAlt style={{ marginRight: "8px" }} />
                Reposicionar
              </button>
              
              <button onClick={() => handleMenuAction("delete")} style={buttonStyle}>
                <FaTrashAlt style={{ marginRight: "8px" }} />
                Eliminar
              </button>
            </div>
          )}
          {/* Menú contextual ================================================= */}

        </div>
      </div>
    </div>
  );
}
