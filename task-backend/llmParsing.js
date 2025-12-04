import {Groq} from  'groq-sdk'
// const groqLLMObject = new Groq({apiKey:process.env.GROQ_API_KEY});
const groqLLMObject = new Groq({apiKey:"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"});


export const LLMRequests  = async(message="") =>{
    const response = await groqLLMObject.chat.completions.create({
        "messages": [
        {
          "role": "user",
          "content": `
           *** THIS BELOW CONTENT IS NOT A JSON ***
            ROLE : You are a smart manager with good language interpretation skills, you understand the requirement people make and fetch the required data from the requiremnent
                   and return in the form of json
            INPUT_CONDITIONS : You are going to receive paragraphs which may or maynot specify some or all of the below pointers, which are:
                                - Title: The main task synopsis, or effective delivery , **SHOULD NOT CONTAIN PRIORITY RELATED WORDS**
                                - Due Date: Parse relative dates ("tomorrow", "next Monday", "in 3 days") and absolute dates ("15th January", "Jan 20"), ***SHOULD BE A FORMAT THAT CAN BE PASSED TO NODE JS DATE CONSTRUCTOR, YYYY-MM-DD***
                                - Priority: Identify keywords like "urgent", "high priority", "low priority", "critical"
                                - Status: Default to "TO DO" unless specified otherwise
                                - Handle variations in phrasing (e.g., "due by Friday" vs "by Friday" vs "before Friday")
                                - the input has a keyword ['REFERENCE CREATED DATE'] followed by a set of nodejs date in curlybraces
                                - ignore the exclamatory or questioning texts , which the input message has because the user might have understood this chat window as question and answer, 
                                - dont repeat same text with same meaning and context in decription and title
                                - the description , must not use verbs specified by the user, the meaning of the verbs should be used , else exact description shopuld be fetched
                                - your thinking and decisions should not be present in the content sent to the output ****VERY IMPORTANT ****
            INPUT_TEXT : ${message.trim()}['REFERENCE CREATED DATE']{${new Date()}}
            OUTPUT_STRUCTURES : you are going to return a JSON String with the below feilds:
                                {
                                     status  , //either one of TO DO, REJECTED, IN PROGRESS, COMPLETED 
                                     priority, // high, low, critical, medium
                                     dueDate, // a javascript , new Date constuctor acceptable format, YYYY-MM-DD, there should not be any eval code
                                     title, // optimal  title for the input which specifies the intent of task,
                                     description // entire description , dont over imagine task
                                } ,
            if any data is not clear , create leave the feild blank.
          `
        }
      ],
       "model":"openai/gpt-oss-120b",
       "temperature": 1,
       response_format:{
        type:'json_object',
       },
        "max_completion_tokens": 4096,
        "reasoning_effort": "high",
    })


    let value = response.choices[0].message.content;
    console.log(value);
    
    const jsObj = {};
    try{
      value = value.replaceAll('{','').replaceAll('}','').replaceAll('"','');
      value.split(',').forEach((val, idx)=>{
        let valTemp = val.split(':');
        jsObj[valTemp[0]] =valTemp[1];
      })
    }catch(err){
      console.error(err);
    }
    return jsObj;
}

// LLMRequests(`create a task for me on the last friday , any months from now and only if the friday is on the 28th of the month, The task is a critical work, I need to fix my life then, got it ?`);