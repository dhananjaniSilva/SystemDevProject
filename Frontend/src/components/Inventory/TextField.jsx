import Form from 'react-bootstrap/Form';

function FormTextExample(props) {
  return (
    <>
      
      <Form.Control
        type={props.type}
        id="inputPassword5"
        aria-describedby="passwordHelpBlock"
        placeholder={props.placeholderValue}
      />
      {/* <Form.Text id="passwordHelpBlock" muted>
        Your password must be 8-20 characters long, contain letters and numbers,
        and must not contain spaces, special characters, or emoji.
      </Form.Text> */}
    </>
  );
}

export default FormTextExample;