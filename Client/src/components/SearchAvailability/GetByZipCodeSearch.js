import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom'


class GetByZipCodeSearch extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: '', 
        error: null, 
        isLoaded: false, 
        items: []
      };
    }
  
    handleChange = (event) => {
        this.setState({value: event.target.value}, () => console.log("zip code: " + this.state.value)); //id number typed into value box
    }

    handleSubmit = (event) => {
        fetch(`/user/${this.state.value}`)
          .then(res => res.json()) //turn response into json
          .then( 
            (result) => { //use results in setState
              console.log(result)
              this.setState({
                isLoaded: true, //the result state is changed to true
                items: result//the result state is changed to the info thats been fetched and turned into json
              });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error // the error that's received 
              });
            }
          )
        event.preventDefault();
    }
  
    userCard = () =>{
      const {items} = this.state;
        return (  
          <div className="card-group">
           {items.map(item => (
                    <div key={item.user_id} className="row"> 
                    <Card border="dark" style={{ width: '18rem', color: 'teal'}}>
                        <Card.Header>User Name: {item.user_name} </Card.Header>
                        <Card.Body>
                            <Card.Title>User Zip Code: {item.home_zip_code}</Card.Title>{/* TODO: Would like to hide later */}
                            <Card.Subtitle className="mb-2 text-muted">Number Children: {item.num_children} <br/> Children Age Group: {item.child_group}</Card.Subtitle>
                            <Card.Text>{item.description}</Card.Text>
                            <Link to={ROUTES.REQUEST_CONTACT}> Send Request</Link> 
                        </Card.Body>
                        </Card>
                    </div>
                ))}
          </div>
        )
    }    
    

    render() {
      const { value, /*items*/ } = this.state; //allows this.state to be assumed
      const { handleSubmit, handleChange } = this; 
      return (
        <section>
          <form onSubmit={handleSubmit}>
            <label>
              Submit Zip Code Here
              <input 
              type="text" 
              placeholder="i.e. 94545" 
              value={value} 
              onChange={handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          {this.state.isLoaded ? 
    
          <this.userCard/>
      
          : null
          }
        </section>
      );
    }
}

    


  export default GetByZipCodeSearch;