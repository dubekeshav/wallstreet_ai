
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Chart3DProps {
  data?: number[];
  width?: number;
  height?: number;
  className?: string;
}

const Chart3D: React.FC<Chart3DProps> = ({
  data = [25, 30, 45, 60, 35, 22, 65, 40],
  width = 600,
  height = 400,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    bars: THREE.Mesh[] | null;
    isAnimating: boolean;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    bars: null,
    isAnimating: false,
  });

  // Define chart colors
  const colors = [
    '#4285F4', // Google Blue
    '#EA4335', // Google Red
    '#FBBC05', // Google Yellow
    '#34A853', // Google Green
    '#8AB4F8', // Light blue
    '#F6AEA9', // Light red
    '#FDE293', // Light yellow
    '#A8DAB5', // Light green
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(100, 100, 200);
    camera.lookAt(scene.position);

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    // Clean up previous renders
    if (containerRef.current.childNodes.length > 0) {
      containerRef.current.innerHTML = '';
    }
    
    containerRef.current.appendChild(renderer.domElement);

    // Add grid
    const gridHelper = new THREE.GridHelper(200, 20, 0xd9d9d9, 0xe0e0e0);
    gridHelper.position.y = -10;
    scene.add(gridHelper);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 200, 100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add a point light
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(-100, 200, -100);
    scene.add(pointLight);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minDistance = 60;
    controls.maxDistance = 400;

    // Create bars
    const bars: THREE.Mesh[] = [];
    const spacing = 25;
    const maxHeight = 100;
    const barWidth = 15;
    
    // Calculate starting position (to center the bars)
    const totalWidth = spacing * (data.length - 1);
    const startX = -totalWidth / 2;

    // Create bars with normalized heights
    data.forEach((value, index) => {
      // Normalize the data value to a reasonable height
      const normalizedHeight = (value / Math.max(...data)) * maxHeight;
      
      // Create bar geometry
      const geometry = new THREE.BoxGeometry(barWidth, normalizedHeight, barWidth);
      
      // Create material with corresponding color from our colors array
      const colorIndex = index % colors.length;
      const color = new THREE.Color(colors[colorIndex]);
      
      const material = new THREE.MeshPhongMaterial({
        color: color,
        specular: 0x333333,
        shininess: 40,
        emissive: new THREE.Color(colors[colorIndex]).multiplyScalar(0.2),
      });
      
      // Create mesh
      const bar = new THREE.Mesh(geometry, material);
      
      // Position bar
      bar.position.x = startX + index * spacing;
      bar.position.y = normalizedHeight / 2 - 10; // Adjust to sit on grid
      
      // Add shadow
      bar.castShadow = true;
      bar.receiveShadow = true;
      
      // Start with scale 0 for animation
      bar.scale.y = 0.001;
      
      // Add to scene and to our bars array
      scene.add(bar);
      bars.push(bar);
    });

    // Add a label platform below the chart
    const platformGeometry = new THREE.BoxGeometry(totalWidth + spacing * 2, 2, spacing * 2);
    const platformMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      transparent: true,
      opacity: 0.8,
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -11;
    platform.receiveShadow = true;
    scene.add(platform);

    // Store references
    chartRef.current = {
      scene,
      camera,
      renderer,
      controls,
      bars,
      isAnimating: true,
    };

    // Animation function
    const animate = () => {
      if (!chartRef.current.isAnimating) return;

      requestAnimationFrame(animate);

      // Animate bars growing from 0 to full height
      if (chartRef.current.bars) {
        let allDone = true;
        chartRef.current.bars.forEach((bar) => {
          if (bar.scale.y < 1) {
            bar.scale.y += 0.03;
            allDone = false;
          }
          if (bar.scale.y > 1) bar.scale.y = 1;
        });

        // Stop animation loop once all bars are at full height
        if (allDone) {
          chartRef.current.isAnimating = false;
        }
      }

      // Update controls
      if (chartRef.current.controls) {
        chartRef.current.controls.update();
      }

      // Render scene
      if (chartRef.current.renderer && chartRef.current.scene && chartRef.current.camera) {
        chartRef.current.renderer.render(chartRef.current.scene, chartRef.current.camera);
      }
    };

    // Start animation
    animate();

    // Auto-rotate for initial impression
    const rotationInterval = setInterval(() => {
      if (chartRef.current.controls) {
        chartRef.current.controls.autoRotate = true;
        chartRef.current.controls.autoRotateSpeed = 1;
        chartRef.current.controls.update();
        chartRef.current.isAnimating = true;
        
        if (chartRef.current.renderer && chartRef.current.scene && chartRef.current.camera) {
          chartRef.current.renderer.render(chartRef.current.scene, chartRef.current.camera);
        }
      }
    }, 100);

    // Stop auto-rotation after 3 seconds
    setTimeout(() => {
      clearInterval(rotationInterval);
      if (chartRef.current.controls) {
        chartRef.current.controls.autoRotate = false;
      }
    }, 3000);

    // Handle window resize
    const handleResize = () => {
      if (!chartRef.current.camera || !chartRef.current.renderer) return;
      
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      
      // Update camera aspect ratio
      chartRef.current.camera.aspect = newWidth / newHeight;
      chartRef.current.camera.updateProjectionMatrix();
      
      // Update renderer size
      chartRef.current.renderer.setSize(newWidth, newHeight);
      
      // Force a render
      chartRef.current.isAnimating = true;
      animate();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (chartRef.current.controls) {
        chartRef.current.controls.dispose();
      }
      
      if (containerRef.current && chartRef.current.renderer) {
        containerRef.current.removeChild(chartRef.current.renderer.domElement);
      }
      
      if (chartRef.current.renderer) {
        chartRef.current.renderer.dispose();
      }
      
      // Dispose geometries and materials
      if (chartRef.current.bars) {
        chartRef.current.bars.forEach((bar) => {
          bar.geometry.dispose();
          (bar.material as THREE.Material).dispose();
        });
      }
      
      // Clear the scene
      if (chartRef.current.scene) {
        chartRef.current.scene.clear();
      }
      
      // Reset animation state
      chartRef.current.isAnimating = false;
    };
  }, [data, width, height, colors]);

  return (
    <div 
      ref={containerRef} 
      className={`chart-3d-container ${className}`}
      style={{ width: '100%', height: `${height}px` }}
    />
  );
};

export default Chart3D;
