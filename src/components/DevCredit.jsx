function DevCredit({ size = 34 }) {
  return (
    <a
     href="#"//"https://mohamedjasith.vercel.app/"
      target="_blank"
      rel="noreferrer"
      className="dev-credit"
      aria-label="Developed by Mohamed Jasith"
    >
      <span className="dev-credit-text">Developed by</span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 152 158"
        width={size}
        height={size}
        className="dev-credit-logo"
        aria-hidden="true"
      >
        <g fill="currentColor" fillRule="evenodd">
          <path d="M 25 10 L 39 35 L 86 66 L 101 104 L 116 110 L 117 101 L 122 105 L 125 123 L 128 109 L 89 61 Z" />
          <path d="M 20 27 L 26 41 L 46 55 L 29 50 L 37 62 L 51 69 L 42 70 L 55 86 L 84 99 L 63 57 Z" />
          <path d="M 102 24 L 104 52 L 96 43 L 95 55 L 113 85 L 120 63 Z" />
          <path d="M 82 101 L 67 104 L 35 125 L 45 127 L 56 120 L 57 122 L 48 133 L 61 129 Z" />
          <path d="M 88 118 L 85 127 L 88 127 L 93 133 L 88 135 L 87 138 L 95 138 L 97 141 L 96 147 L 99 146 L 100 139 L 102 147 L 104 143 L 103 137 L 97 134 L 93 127 L 98 116 Z" />
          <path d="M 50 70 L 51 69 L 53 70 L 52 71 Z" />
          <path d="M 45 56 L 46 55 L 48 56 L 47 57 Z" />
          <path d="M 56 120 L 57 119 L 58 120 L 57 121 Z" />
          <path d="M 115 101 L 116 100 L 117 101 L 116 102 Z" />
          <path d="M 47 57 L 48 56 L 49 57 L 48 58 Z" />
        </g>
      </svg>
    </a>
  );
}

export default DevCredit;