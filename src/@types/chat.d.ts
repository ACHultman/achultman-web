type Speaker = 'bot' | 'user'

type Message = {
    author: Speaker
    text: string
}

type Conversation = {
    history: Array<Message>
}
