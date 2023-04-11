export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function getDistance(pointA: number[], pointB: number[]): number {
  return Math.sqrt(
    (pointA[1] - pointB[1]) * (pointA[1] - pointB[1]) +
    (pointA[0] - pointB[0]) * (pointA[0] - pointB[0])
  );
}
