import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '2m',  target: 100 },   // durante esta fase, detén service-b
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    checks: ['rate>0.80'],
  },
};

const BASE = 'http://localhost:8000';
const IDS = ['ord-001','ord-002','ord-003','ord-004','ord-005'];

export default function () {
  if (Math.random() < 0.85) {
    const id = IDS[Math.floor(Math.random()*IDS.length)];
    const res = http.get(`${BASE}/order/${id}`);
    check(res, { 'ok 200': (x) => x.status === 200 });
  } else {
    const res = http.get(`${BASE}/order/ord-999`);   // inexistente -> 404
    check(res, { '404': (x) => x.status === 404 });
  }
  sleep(0.3);
}
