import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function DashbaordCardComponent() {
  return (
    <Card style={{width:"100%"}}>
      <Card.Header>Featured</Card.Header>
      <Card.Body>
        <Card.Title>Special title treatment</Card.Title>
        <Card.Text>
          With supporting text below as a natural lead-in to additional content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

export default DashbaordCardComponent;