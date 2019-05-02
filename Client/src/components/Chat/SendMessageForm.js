import React from 'react';

class SendMessageForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            text: ''
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.username)
    }

    onChange = (event) => {
        this.setState({text: event.target.value})
    }

    render(){
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input
                        type="text"
                        placeholder="What is your text"
                        onChange={this.onChange}
                    />
                    <input type="submit"/>
                </form>
            </div>
        )
    }


}

export default SendMessageForm;
