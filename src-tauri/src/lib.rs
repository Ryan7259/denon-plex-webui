/*
    avoid using mutex since its held on to forever in while loop, use channels

    have 3 threads, use a mpsc channel
        one for mapping cmds and waiting for responses to emit to frontend
        one for stream to read responses from device, parsing them as JSON and sending them as events/responses to reply service
        main for cmds to be written to device and sent to reply service

    connect_to_ip should spawn and start all these tasks

    1. hashmap reply handler service creates a channel and clones its senders to handout
        - stream writer and reader need one for mapping cmds and replying to responses
    
    2. stream reader loop waits for events/responses from stream/device
        - parses response as JSON and determines what kind of response: event or reply

    3. stream writer is unblocked in main waiting for send_cmd invocations from frontend
        - awaits oneshot mapping in reply service to prevent racing of receiving responses before it is mapped
*/