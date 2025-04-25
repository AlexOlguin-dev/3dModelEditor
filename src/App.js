import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { FaFlag, FaFont, FaPalette, FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";
import { AppBar, Toolbar, Typography, Tooltip } from "@mui/material";
import RC from './assets/img/RC.png';
import LC from './assets/img/LC.png';
import SCROLL from './assets/img/SCROLL.png';

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

function Flag2({ position, onPointerOver, onPointerOut, onContextMenu }) {
  return (
    <mesh position={position} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onContextMenu={onContextMenu}>
      <sphereGeometry args={[0.04, 5, 5]} />
      <meshStandardMaterial color="red" />
    </mesh>
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
  const [flags, setFlags] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedFlagId, setSelectedFlagId] = useState(null);
  const [selectedTooltipText, setSelectedTooltipText] = useState(null);

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
      setFlags([...flags, { id: Date.now(), position: [point.x, point.y, point.z], tooltipText: "NO DATA" }]);
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
            flag.tooltipText = newTooltipText;
          }
        })
        setFlags([...flags]);
        break;

      case "delete":
        setFlags(flags.filter(flag => flag.id !== selectedFlagId));
        break;
      default:
        break;
    }
    setContextMenu(null); // Cerrar el menú después de hacer una acción
    setSelectedFlagId(null); // Limpiar la id seleccionada
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

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", display: "flex", flexDirection: "column" }}>
      
      {/* ✅ Barra de navegación superior */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Visor 3D de Tuberías
          </Typography>
        </Toolbar>
      </AppBar>

      {/**Instrucciones de manejo 3d */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "300px", height: "100px", backgroundColor: "rgba(128, 128, 128, 0.5)", display: "flex", justifyContent: "space-around", alignItems: "center", borderRadius: "10px", padding: "10px", color: "white" }}>
        {/* Imagen LC con texto */}
        <div style={{ textAlign: "center" }}>
          <img src={LC} alt="LC" style={{ width: "30px" }} />
          <Typography fontSize={12} fontWeight="bold">Rotar</Typography>
        </div>

        {/* Imagen SCROLL con texto */}
        <div style={{ textAlign: "center" }}>
          <img src={SCROLL} alt="SCROLL" style={{ width: "30px" }} />
          <Typography fontSize={12} fontWeight="bold">Zoom</Typography>
        </div>

        {/* Imagen RC con texto */}
        <div style={{ textAlign: "center" }}>
          <img src={RC} alt="RC" style={{ width: "30px" }} />
          <Typography fontSize={12} fontWeight="bold">Dragg</Typography>
        </div>
      </div>

      {/* Contenedor principal debajo del AppBar */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* Barra lateral */}
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
            <button
              style={{ background: "none", border: "none", cursor: "pointer", color: "white", fontSize: "24px" }}
            >
              <FaExclamationTriangle />
            </button>
          </Tooltip>
        </div>

        {/* Área principal */}
        <div style={{ flex: 1, position: "relative" }}>

          {/* Canvas 3D */}
          <Canvas camera={{ position: [0, 2, 5], fov: 50 }} onPointerMissed={() => setFlagMode(false)}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Model onClick={handleClick} />
            {flags.map((flag) => (
              <Flag
                key={flag.id}
                position={flag.position}
                onPointerOver={(event) => handlePointerOver(event, flag.id)}
                onPointerOut={handlePointerOut}
                onContextMenu={(event) => handleContextMenu(event, flag.id)}
              />
            ))}
            <OrbitControls />
          </Canvas>

          {/* Tooltip */}
          {tooltip && (
            <TooltipM position={tooltip} message={selectedTooltipText || "NO DATA"} />
          )}

          {/* Menú contextual */}
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
              <button onClick={() => handleMenuAction("delete")} style={buttonStyle}>
                <FaTrashAlt style={{ marginRight: "8px" }} />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
