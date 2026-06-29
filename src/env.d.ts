/// <reference types="astro/client" />

declare module "3d-force-graph" {
  const ForceGraph3D: any;
  export default ForceGraph3D;
}

declare module "msgpackr" {
  export function encode(data: any): Buffer | Uint8Array;
  export function decode(buffer: Uint8Array): any;
}

declare module "three" {
  namespace THREE {
    type ColorRepresentation = string | number;
    class Color {
      constructor(color?: ColorRepresentation);
      set(color: ColorRepresentation): this;
      clone(): Color;
      copy(c: Color): this;
      getHex(): number;
    }
    class Vector3 {
      x: number;
      y: number;
      z: number;
      constructor(x?: number, y?: number, z?: number);
      set(x: number, y: number, z: number): this;
      addVectors(a: Vector3, b: Vector3): this;
      subVectors(a: Vector3, b: Vector3): this;
      multiplyScalar(s: number): this;
      normalize(): this;
      length(): number;
      copy(v: Vector3): this;
      addScaledVector(v: Vector3, s: number): this;
    }
    class Quaternion {
      setFromUnitVectors(from: Vector3, to: Vector3): this;
      copy(q: Quaternion): this;
    }
    class BufferGeometry {
      setAttribute(name: string, attr: any): void;
      attributes: Record<string, any>;
    }
    class BufferAttribute {
      constructor(array: any, size: number);
      needsUpdate: boolean;
      array: any;
    }
    class LineBasicMaterial {
      constructor(params?: any);
      color: any;
      opacity: number;
      transparent?: boolean;
      needsUpdate?: boolean;
      depthWrite?: boolean;
    }
    class LineSegments {
      constructor(geom?: BufferGeometry, mat?: LineBasicMaterial);
      geometry: BufferGeometry;
      material: any;
    }
    class CylinderGeometry {
      constructor(rt?: number, rb?: number, h?: number, segs?: number);
    }
    class ConeGeometry {
      constructor(radius?: number, height?: number, radialSegments?: number, heightSegments?: number);
    }
    class SphereGeometry {
      constructor(radius?: number, widthSegments?: number, heightSegments?: number);
    }
    class MeshStandardMaterial {
      constructor(params?: any);
      color: any;
      emissive: any;
      emissiveIntensity: number;
      transparent?: boolean;
      opacity: number;
      depthWrite?: boolean;
    }
    class MeshBasicMaterial {
      constructor(params?: any);
      color: any;
    }
    class MeshLambertMaterial {
      constructor(params?: any);
      color: any;
    }
    class PointsMaterial {
      constructor(params?: any);
      color: any;
      size: number;
      sizeAttenuation: boolean;
    }
    class Points extends Object3D {
      constructor(geom?: BufferGeometry, mat?: PointsMaterial);
      material: PointsMaterial;
    }
    class Mesh extends Object3D {
      constructor(geom?: any, mat?: any);
      position: Vector3;
      quaternion: Quaternion;
      scale: Vector3;
      geometry: any;
      material: any;
    }
    class Group {
      children: any[];
      add(child: any): void;
      remove(child: any): void;
      visible: boolean;
    }
    class Object3D {
      children: any[];
      scale: Vector3;
    }
    class Material {
      dispose(): void;
    }
    class PerspectiveCamera {}
    class LOD extends Object3D {
      addLevel(object: Object3D, distance: number): void;
      levels: Array<{ object: Object3D; distance: number }>;
      update(camera: PerspectiveCamera): void;
      getCurrentLevel(): number;
      isLOD: boolean;
    }
  }
  export = THREE;
}

declare module "d3-force-3d" {
  export function forceSimulation(nodes?: any[], dimensions?: number): any;
  export function forceLink(links?: any[]): any;
  export function forceManyBody(): any;
  export function forceCenter(x?: number, y?: number, z?: number): any;
}

interface Window {
  __graphApi?: {
    find?: (q: string) => Array<{ id: string; name: string; url?: string }>;
    focusNodeById?: (id: string) => void;
    focusByDomain?: (domain: string) => void;
    highlightNodesAndNeighbors?: (ids: string[]) => void;
    highlightNodesByDomain?: (domainOrIds: string | string[]) => void;
    clearHighlights?: () => void;
    clearLocalEffects?: () => void;
    getGraphData?: () => any;
    showShortestPath?: (fromId: string, toId: string) => string[] | null;
    stepPathNext?: () => boolean;
    stepPathPrev?: () => boolean;
    clearPath?: () => void;
    getPathInfo?: () => { path: string[]; totalSteps: number; currentStep: number; currentId: string | null } | null;
  };
  __toggleOpacityPanel?: () => void;
}
