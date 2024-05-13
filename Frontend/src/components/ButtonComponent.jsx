import { ClassNames } from '@emotion/react';
import Button from 'react-bootstrap/Button';
import '../stylings/components/buttonComponent.css'

function ButtonComponent(props) {
  return (
    <>
      <Button variant={props.variant} className={props.className}>+ {props.text}</Button>{' '}
    </>
  );
}

export default ButtonComponent;