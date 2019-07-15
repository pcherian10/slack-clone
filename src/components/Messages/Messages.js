import React from 'react'
import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'
import Message from './Message'
import firebase from '../../firebase'
import { Segment, Comment } from 'semantic-ui-react'

class Messages extends React.Component {

    state = {
        user: this.props.currentUser,
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        messages: [],
        messagesLoading: false
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if ( channel && user ) {
            this.addListeners(channel.id)
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val())
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
        })
    }

    displayMessages = messages => (
      messages.length > 0 && messages.map( message =>  
          <Message
            key={message.timestamp}
            message={message}
            user={this.state.user}
          /> 
        )
    )
    
    render() {
        const  { messagesRef, channel, messages } = this.state
        return (
            <React.Fragment>`
                <MessagesHeader />
                <Segment>
                    <Comment.Group className="messages">
                        {this.displayMessages(messages)}
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