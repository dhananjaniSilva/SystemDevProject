import { ClassNames } from "@emotion/react";
import Button from "react-bootstrap/Button";
import "../stylings/components/buttonComponent.css";

function ButtonComponent(props) {
  const { variant, className, onClick, icon: IconComponent, text ,color} = props;

  return (
    <>
      <Button variant={variant} className={className} onClick={onClick} style={{backgroundColor:`${color}`}}>
        {IconComponent && <IconComponent />} {text}
      </Button>
    </>
  );
}

export default ButtonComponent;
