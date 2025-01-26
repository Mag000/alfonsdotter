import ReactDOM from "react-dom/client";
import ResponsivePage from "./components/ResponsivePage";
import "./index.css";
import { IResponsivePage } from "./model/IReponsivePage";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const page: IResponsivePage = {
  headline: "Rubrik 1",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur\nsuscipit in purus at consectetur. Sed magna nunc, ultrices ut magna\nquis, ullamcorper accumsan libero. Interdum et malesuada fames ac\nante ipsum primis in faucibus. Cras blandit risus elit, vitae\n  aliquam purus auctor id. Proin ac porta ante. Sed imperdiet\n  tincidunt ligula. Ut iaculis mi massa, a scelerisque sapien\n  venenatis id. Donec non felis ultricies mauris elementum\n  ullamcorper. Quisque semper a felis at hendrerit. Sed ac molestie\n  sem. Integer consequat sed odio eget facilisis. Donec eleifend nibh\n  id felis pellentesque, non aliquet risus consequat. Ut neque sem,\n  viverra in leo porttitor, ullamcorper aliquam risus. Morbi eu arcu\n  eget orci facilisis venenatis. Nunc lobortis ornare lorem, sagittis\n  scelerisque massa tincidunt sit amet. Vestibulum finibus volutpat\n  elit eu tincidunt. Integer id condimentum enim. Fusce posuere nulla\n  egestas tincidunt faucibus. In interdum, odio aliquam laoreet\n  vestibulum, odio massa gravida odio, eget blandit magna neque ut\n  nisl. Phasellus ut tincidunt dui. Fusce quis elementum lectus.\n  Quisque tempor at nisl ut mollis. Integer dapibus erat vel est\n  laoreet, ac mollis leo ultrices. Maecenas scelerisque orci at neque\n  tempus, sed volutpat quam ullamcorper. Curabitur vehicula ante eu\n  enim faucibus, quis pharetra tortor laoreet. Suspendisse consectetur\n  sapien egestas, dapibus elit quis, accumsan arcu. Quisque venenatis\n  luctus commodo. Quisque nec est quis augue ornare ullamcorper in in\n  dui. Vestibulum euismod, dolor ac dapibus blandit, nibh ante.",
};
root.render(<ResponsivePage {...page} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
