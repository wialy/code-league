import { Body } from "matter-js";

export type AbstractBody = Pick<
  Body,
  "position" | "angle" | "id" | "isStatic" | "velocity" | "angularVelocity"
>;
export type PlayerBody = AbstractBody & Required<Pick<Body, "circleRadius">>;
export type WallBody = AbstractBody & Required<Pick<Body, "bounds">>;

export type Snapshot = (PlayerBody | WallBody)[];

export const isPlayerBody = (body: AbstractBody): body is PlayerBody => {
  return "circleRadius" in body;
};

export const isWallBody = (body: AbstractBody): body is WallBody => {
  return "bounds" in body;
};
