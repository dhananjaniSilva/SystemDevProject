import { ClassNames } from "@emotion/react";
import Button from "react-bootstrap/Button";
import "../stylings/components/buttonComponent.css";

function ButtonComponent(props) {
  const { variant, className, onClick, icon: IconComponent, text } = props;

  return (
    <>
      <Button variant={variant} className={className} onClick={onClick}>
        {IconComponent && <IconComponent />} {text}
      </Button>
    </>
  );
}

export default ButtonComponent;
