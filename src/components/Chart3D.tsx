
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Chart3DProps {
  className?: string;
}

const Chart3D: React.FC<Chart3DProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6f6f6);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    scene.add(gridHelper);
    
    // Create bars with finance data
    const createBars = () => {
      const barGroup = new THREE.Group();
      
      // Sample financial data (month, value)
      const data = [
        { month: 'Jan', value: 10 },
        { month: 'Feb', value: 15 },
        { month: 'Mar', value: 13 },
        { month: 'Apr', value: 17 },
        { month: 'May', value: 20 },
        { month: 'Jun', value: 18 },
        { month: 'Jul', value: 22 },
        { month: 'Aug', value: 25 },
        { month: 'Sep', value: 23 },
        { month: 'Oct', value: 28 },
        { month: 'Nov', value: 33 },
        { month: 'Dec', value: 39 },
      ];
      
      // Colors for the gradient
      const colors = [
        new THREE.Color(0xFF8C00), // Dark Orange
        new THREE.Color(0x2E8B57), // Sea Green
        new THREE.Color(0x4682B4), // Steel Blue
      ];
      
      // Create bars
      data.forEach((item, i) => {
        const height = item.value * 0.25;
        const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
        
        // Calculate color based on value
        const colorIndex = Math.floor((item.value / 40) * (colors.length - 1));
        const t = (item.value / 40) * (colors.length - 1) - colorIndex;
        
        let barColor;
        if (colorIndex >= colors.length - 1) {
          barColor = colors[colors.length - 1];
        } else {
          barColor = new THREE.Color().lerpColors(
            colors[colorIndex],
            colors[colorIndex + 1],
            t
          );
        }
        
        const material = new THREE.MeshPhongMaterial({ 
          color: barColor,
          transparent: true,
          opacity: 0.9,
          emissive: barColor,
          emissiveIntensity: 0.2,
        });
        
        const bar = new THREE.Mesh(geometry, material);
        
        // Position the bar
        bar.position.x = i * 1.2 - (data.length * 1.2) / 2 + 0.6;
        bar.position.y = height / 2;
        
        // Add tooltip data
        bar.userData = { month: item.month, value: item.value };
        
        barGroup.add(bar);
        
        // Add text labels
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
          const textGeometry = new THREE.TextGeometry(item.month, {
            font: font,
            size: 0.3,
            height: 0.02,
          });
          const textMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          
          textMesh.position.x = bar.position.x - 0.3;
          textMesh.position.y = -0.5;
          textMesh.position.z = 0.5;
          textMesh.rotation.x = -Math.PI / 4;
          
          barGroup.add(textMesh);
        });
      });
      
      scene.add(barGroup);
      return barGroup;
    };
    
    const barGroup = createBars();
    
    // Add trend line
    const createTrendLine = () => {
      const data = [10, 15, 13, 17, 20, 18, 22, 25, 23, 28, 33, 39];
      const points = [];
      
      data.forEach((value, i) => {
        points.push(new THREE.Vector3(
          i * 1.2 - (data.length * 1.2) / 2 + 0.6,
          value * 0.25 + 0.5,
          0
        ));
      });
      
      const lineCurve = new THREE.CatmullRomCurve3(points);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(
        lineCurve.getPoints(50)
      );
      
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x4682B4,
        linewidth: 2,
      });
      
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      
      return line;
    };
    
    const trendLine = createTrendLine();
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the scene slightly
      if (!controls.enableRotate) {
        barGroup.rotation.y += 0.002;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Add hover interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    let tooltipEl: HTMLDivElement | null = null;
    
    // Create tooltip element
    const createTooltip = () => {
      const tooltip = document.createElement('div');
      tooltip.style.position = 'absolute';
      tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      tooltip.style.color = 'white';
      tooltip.style.padding = '8px 12px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '14px';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.display = 'none';
      tooltip.style.zIndex = '1000';
      tooltip.style.transition = 'all 0.2s ease';
      
      if (containerRef.current) {
        containerRef.current.appendChild(tooltip);
      }
      
      return tooltip;
    };
    
    tooltipEl = createTooltip();
    
    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !tooltipEl) return;
      
      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Find intersections with bars
      const intersects = raycaster.intersectObjects(barGroup.children);
      
      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        
        // Only show tooltip for bars (which have userData)
        if (intersected.userData && intersected.userData.month) {
          // Show and position tooltip
          tooltipEl.style.display = 'block';
          tooltipEl.style.left = `${event.clientX}px`;
          tooltipEl.style.top = `${event.clientY - 40}px`;
          tooltipEl.innerHTML = `${intersected.userData.month}: $${intersected.userData.value}K`;
          
          // Highlight the intersected bar
          (intersected as THREE.Mesh).material = new THREE.MeshPhongMaterial({
            color: 0xff9933,
            emissive: 0xff9933,
            emissiveIntensity: 0.3,
          });
        }
      } else {
        // Hide tooltip when not hovering over a bar
        tooltipEl.style.display = 'none';
        
        // Reset materials of all bars
        barGroup.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry) {
            // Get position to determine color gradient
            const index = Math.floor((child.position.x + (data.length * 1.2) / 2) / 1.2);
            const value = data[index]?.value || 0;
            
            // Calculate color based on value
            const colorIndex = Math.floor((value / 40) * (colors.length - 1));
            const t = (value / 40) * (colors.length - 1) - colorIndex;
            
            let barColor;
            if (colorIndex >= colors.length - 1) {
              barColor = colors[colors.length - 1];
            } else {
              barColor = new THREE.Color().lerpColors(
                colors[colorIndex],
                colors[colorIndex + 1],
                t
              );
            }
            
            child.material = new THREE.MeshPhongMaterial({ 
              color: barColor,
              transparent: true,
              opacity: 0.9,
              emissive: barColor,
              emissiveIntensity: 0.2,
            });
          }
        });
      }
    };
    
    containerRef.current.addEventListener('mousemove', onMouseMove);
    
    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        if (tooltipEl) {
          containerRef.current.removeChild(tooltipEl);
        }
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', onMouseMove);
      }
      
      // Dispose of Three.js resources
      renderer.dispose();
      
      barGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full min-h-[300px] rounded-lg overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/20 rounded-lg" />
    </div>
  );
};

export default Chart3D;
