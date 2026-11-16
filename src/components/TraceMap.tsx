const course = "M36,348 C96,318 112,236 186,222 S300,262 344,178 S436,96 524,72";
const trace = "M36,348 C96,318 112,236 186,222 C214,217 236,224 258,228";
const offRoute = "M258,228 C280,196 300,170 344,178";
const rest = "M344,178 C366,136 436,96 524,72";

export default function TraceMap() {
  return (
    <figure className="trace-map" aria-hidden="true">
      <svg viewBox="0 0 560 420" role="presentation">
        <g className="contours">
          <path d="M-20,120 C80,60 180,150 280,110 S470,20 600,90" />
          <path d="M-20,170 C90,110 190,200 290,160 S480,70 600,140" />
          <path d="M-20,225 C100,170 200,255 300,215 S490,125 600,195" />
          <path d="M-20,285 C110,235 210,315 310,275 S500,185 600,255" />
          <path d="M-20,345 C120,300 220,375 320,335 S510,250 600,315" />
          <path d="M-20,400 C130,360 230,430 330,395 S520,315 600,375" />
        </g>

        <path className="course" d={course} />
        <path className="trace" d={trace} pathLength={1} />
        <path className="off-route" d={offRoute} pathLength={1} />
        <path className="trace trace-late" d={rest} pathLength={1} />

        <g className="safety">
          <rect x="180" y="216" width="12" height="12" rx="2" />
          <rect x="338" y="172" width="12" height="12" rx="2" />
          <rect x="518" y="66" width="12" height="12" rx="2" />
        </g>

        <circle className="runner-halo" r="14">
          <animateMotion dur="16s" repeatCount="indefinite" path={`${trace} ${offRoute.replace("M258,228", "")} ${rest.replace("M344,178", "")}`} />
        </circle>
        <circle className="runner" r="5">
          <animateMotion dur="16s" repeatCount="indefinite" path={`${trace} ${offRoute.replace("M258,228", "")} ${rest.replace("M344,178", "")}`} />
        </circle>

        <g className="map-labels">
          <text x="204" y="250">safety point</text>
          <text className="warn" x="218" y="176">off-route segment</text>
          <text x="52" y="372">start</text>
          <text x="470" y="56">finish</text>
        </g>
      </svg>
      <figcaption>
        <span>
          <i className="key key-course" /> planned course
        </span>
        <span>
          <i className="key key-trace" /> GPS trace
        </span>
        <span>
          <i className="key key-warn" /> evidence for review
        </span>
      </figcaption>
    </figure>
  );
}
