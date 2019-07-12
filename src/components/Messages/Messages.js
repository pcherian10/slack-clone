import React from 'react'
import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'
import firebase from '../../firebase'
import { Segment, Comment } from 'semantic-ui-react'

class Messages extends React.Component {

    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel
    }
    
    render() {
        const  { messagesRef, channel } = this.state
        return (
            <React.Fragment>`
                <MessagesHeader />
                <Segment>
                    <Comment.Group className="messages">
                        {/*Messages*/}
                    </Comment.Group>
                </Segment>
                <MessagesForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={this.props.currentUser}
                />
            </React.Fragment>
        )
    }
}

export default Messages;