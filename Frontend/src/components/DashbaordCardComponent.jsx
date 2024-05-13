import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function DashbaordCardComponent(props) {
    const {bordercolor,headerbackgroundcolor ,toogle,icon:IconComponent}=props;
  return (
    <Card style={{width:"100%",minHeight:"100px",height:"200px",border: `2px solid ${bordercolor}`}}>
     {toogle &&  <Card.Header style={{backgroundColor:`${headerbackgroundcolor}`}}>Featured</Card.Header>}
      <Card.Body>
        <Card.Title style={{textAlign:"center",color:`${bordercolor}`}}>{IconComponent && <IconComponent />}</Card.Title>
        <Card.Text>
          With supporting text below as a natural lead-in to additional content.
        </Card.Text>
        {!toogle && <Card.Header style={{backgroundColor:`${headerbackgroundcolor}`,borderRadius:"5px"}}>Featured</Card.Header>}
      </Card.Body>
     
    </Card>
  );
}

export default DashbaordCardComponent;