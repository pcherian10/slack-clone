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
        messagesLoading: false,
        progressBar: false,
        numUniqueUsers: '',
        searchTerm: "",
        searchLoading: false,
        searchResults: [],
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
            this.countUniqueUsers(loadedMessages);
        })
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages())
    }

    handleSearchMessages = () => {
        const channelMessages = [ ...this.state.messages];
        console.log(channelMessages)

        const regex = new RegExp(this.state.searchTerm, 'gi')
        const searchResults = channelMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) ||
                (message.user.name.match(regex))
            ) {
                acc.push(message);
            }
            return acc
        }, [])
        this.setState({ searchResults });
        setTimeout(() => (this.setState({ searchLoading: false})), 1000)
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce( (acc, message ) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, [])
        const plural = uniqueUsers.length  > 1 || uniqueUsers.length === 0;
        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ""}`
        this.setState({ numUniqueUsers });
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

    isProgressBarVisible = percent => {
        if ( percent > 0) {
            this.setState({ progressBar: true })
        }
    }

    displayChannelName = channel => channel ? `${channel.name}` : '';
    
    render() {
        const  { messagesRef, channel, messages, progressBar, numUniqueUsers, searchTerm, searchResults, searchLoading } = this.state
        return (
            <React.Fragment>`
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={ numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                />
                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessagesForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={this.props.currentUser}
                    isProgressBarVisible = {this.isProgressBarVisible}
                />
            </React.Fragment>
        )
    }
}

export default Messages;