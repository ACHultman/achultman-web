type Author = 'bot' | 'user'

type Message = {
    author: Author
    text: string
}

type Conversation = {
    history: Array<Message>
}
