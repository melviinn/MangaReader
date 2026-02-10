type ReactSvgElement = React.FC<React.SVGProps<SVGSVGElement>>;

const FlagFR: ReactSvgElement = (props) => {
  return (
    <svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <g clipPath="url(#FR_svg__a)">
        <path
          d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z"
          fill="#F0F0F0"
        />
        <path
          d="M24 12c0-5.16-3.257-9.558-7.826-11.254v22.508C20.744 21.558 24 17.159 24 12Z"
          fill="#D80027"
        />
        <path
          d="M0 12c0 5.16 3.257 9.559 7.826 11.254V.747C3.256 2.443 0 6.841 0 12.001Z"
          fill="#0052B4"
        />
      </g>
      <defs>
        <clipPath id="FR_svg__a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const FlagEN: ReactSvgElement = (props) => {
  return (
    <svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <g clipPath="url(#LR_svg__a)">
        <path
          d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z"
          fill="#F0F0F0"
        />
        <path
          d="M2.743 4.363h18.514a12.066 12.066 0 0 0-2.356-2.182H5.1c-.88.62-1.673 1.354-2.357 2.182ZM0 12c0 .368.017.732.05 1.091h23.9a12.146 12.146 0 0 0 0-2.181H.05C.017 11.27 0 11.633 0 12Zm1.309 5.455h21.383c.353-.692.641-1.421.856-2.182H.452c.215.76.504 1.49.857 2.182ZM5.1 21.818h13.8c.88-.62 1.673-1.354 2.357-2.182H2.743A12.067 12.067 0 0 0 5.1 21.818ZM.452 8.728h23.096c-.215-.76-.503-1.49-.856-2.182H1.309a11.922 11.922 0 0 0-.857 2.182Z"
          fill="#F0F0F0"
        />
        <path
          d="M5.74 2.182H18.9A11.945 11.945 0 0 0 12 0c-1.565 0-4.309.808-6.26 2.182Zm5.739 4.363h11.213a12.05 12.05 0 0 0-1.435-2.181h-9.779v2.181Zm0 4.364H23.95a11.959 11.959 0 0 0-.402-2.182h-12.07v2.181ZM.452 15.274h23.096c.199-.703.335-1.433.402-2.182H.05c.067.75.203 1.479.402 2.182Zm2.291 4.363h18.514a12.023 12.023 0 0 0 1.434-2.182H1.31a12 12 0 0 0 1.434 2.182ZM12 24c2.569 0 4.948-.807 6.9-2.181H5.1A11.945 11.945 0 0 0 12 24Z"
          fill="#D80027"
        />
        <path
          d="M.452 8.727a11.957 11.957 0 0 0-.402 2.182H12V-.001C6.507 0 1.876 3.69.452 8.728Z"
          fill="#0052B4"
        />
        <path
          d="m7.144 3.13.777 2.392h2.515L8.4 7l.777 2.391-2.034-1.478L5.11 9.391 5.887 7 3.853 5.522h2.514l.777-2.392Z"
          fill="#F0F0F0"
        />
      </g>
      <defs>
        <clipPath id="LR_svg__a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const FlagJA: ReactSvgElement = (props) => {
  return (
    <svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <g clipPath="url(#JP_svg__a)">
        <path
          d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z"
          fill="#F0F0F0"
        />
        <path
          d="M12 17.218a5.217 5.217 0 1 0 0-10.435 5.217 5.217 0 0 0 0 10.435Z"
          fill="#D80027"
        />
      </g>
      <defs>
        <clipPath id="JP_svg__a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export { FlagEN, FlagFR, FlagJA };
