import { IBodyDefinition } from "matter-js";

export const RENDER_TIME_STEP = 30;
export const RENDER_SCALE = 1;

export const PHYSICS_TIME_STEP = 10;
export const PHYSICS_ITERATIONS =
  (PHYSICS_TIME_STEP * 10_000) / RENDER_TIME_STEP;

export const MAX_FORCE = 1;

export const BALL_ID = 0;

export const GOAL_ID = 1000;

export const FIELD_WIDTH = 1_000;
export const FIELD_HEIGHT = 500;

export const WALL_WIDTH = 100;

export const BALL_RADIUS = 40;
export const PLAYER_RADIUS = 20;

export const PLAYER_CONFIG: IBodyDefinition = {
  restitution: 0.9,
  mass: 80,
  frictionAir: 0.25,
  friction: 1,
  frictionStatic: 0,
};

export const BALL_CONFIG: IBodyDefinition = {
  restitution: 0.9,
  mass: 100,
  id: BALL_ID,
  frictionAir: 0.05,
  friction: 1,
  frictionStatic: 0,
};

export const WALL_CONFIG: IBodyDefinition = {
  isStatic: true,
  restitution: 0,
  mass: 100,
  friction: 0,
};
