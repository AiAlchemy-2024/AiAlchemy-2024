from pathlib import Path
import re
import time

from openai import AzureOpenAI

endpoint =""
temp ="" 

client = AzureOpenAI(
    api_key=temp,
    api_version="2024-02-01",
    azure_endpoint = endpoint
)

deployment_name = "gpt-4o"
sentiment_prompt = Path('sentiments.txt').read_text(encoding='utf-8')
guidelines_prompt = Path('guidelines.txt').read_text(encoding='utf-8')
wrap_prompt = Path('wrap_topic.txt').read_text(encoding='utf-8')
recommendation_prompt = Path('recommendation.txt').read_text(encoding='utf-8')
follow_up_prompt = Path('actionable_follow_up.txt').read_text(encoding='utf-8')
case_id_prompt= Path('caseid.txt').read_text(encoding='utf-8')
summary_prompt = Path('summary.txt').read_text(encoding='utf-8')

def output_parser(llm_response, response_type):
    if response_type == "sentiment":
        sentiment = re.findall(r'<sentiment>(.*?)</sentiment>', llm_response, re.DOTALL) or [""]
        score = re.findall(r'<score>(.*?)</score>', llm_response, re.DOTALL) or [""]
        sentiment_summary = re.findall(r'<sentiment_summary>(.*?)</sentiment_summary>', llm_response, re.DOTALL) or [""]
        sentiment_dict = {
            "sentiment": sentiment[0],
            "score": score[0],
            "sentiment_summary": sentiment_summary[0]
        }
        return sentiment_dict
    elif response_type == "guidelines":
        guidelines = re.findall(r'<guideline>(.*?)</guideline>', llm_response, re.DOTALL) or [""]
        compliance = re.findall(r'<compliance>(.*?)</compliance>', llm_response, re.DOTALL) or [""]
        explanation = re.findall(r'<explanation>(.*?)</explanation>', llm_response, re.DOTALL) or [""]

        guidelines_list = []
        for i in range(len(guidelines)):
            guidelines_dict = {
                "guideline": guidelines[i],
                "compliance": compliance[i],
                "explanation": explanation[i]
            }
            guidelines_list.append(guidelines_dict)
        return guidelines_list
    elif response_type == "wrap":
        wrap_data = re.findall(r'<wrap_topic>(.*?)</wrap_topic>', llm_response, re.DOTALL) or [""]
        wrap_dict = {
            "wrap_topic": wrap_data[0],
        }
        return wrap_dict
    elif response_type == "recommendation":
        recommended_product = re.findall(r'<recommended_product>(.*?)</recommended_product>', llm_response, re.DOTALL) or [""]
        explanation = re.findall(r'<explanation>(.*?)</explanation>', llm_response, re.DOTALL) or [""]
        recommendation_list = []
        for i in range(len(recommended_product)):
            recommendation_dict = {
                "recommended_product": recommended_product[i],
                "explanation": explanation[i]
            }
            recommendation_list.append(recommendation_dict)
        return recommendation_list
    elif response_type == "follow_up":
        description = re.findall(r'<description>(.*?)</description>', llm_response, re.DOTALL) or [""]
        due_date = re.findall(r'<due_date>(.*?)</due_date>', llm_response, re.DOTALL) or [""]
        follow_up_list = []
        for i in range(len(description)):
            follow_up_dict = {
                "description": description[i],
                "due_date": due_date[i]
            }
            follow_up_list.append(follow_up_dict)
        return follow_up_list
    elif response_type == "case_id":
        caseid = re.findall(r'<caseid>(.*?)</caseid>', llm_response, re.DOTALL) or [""]
        case_description = re.findall(r'<case_description>(.*?)</case_description>', llm_response, re.DOTALL) or [""]
        case_belongs_to = re.findall(r'<case_belongs_to>(.*?)</case_belongs_to>', llm_response, re.DOTALL) or [""]
        case_status = re.findall(r'<case_status>(.*?)</case_status>', llm_response, re.DOTALL) or [""]
        case_link = re.findall(r'<case_link>(.*?)</case_link>', llm_response, re.DOTALL) or [""]
        case_created = re.findall(r'<case_created>(.*?)</case_created>', llm_response, re.DOTALL) or [""]
        case_lastupdated = re.findall(r'<case_lastupdated>(.*?)</case_lastupdated>', llm_response, re.DOTALL) or [""]
        caseid_dict = {
            "caseid": caseid[0],
            "case_description": case_description[0],
            "case_belongs_to": case_belongs_to[0],
            "case_status": case_status[0],
            "case_link": case_link[0],
            "case_created": case_created[0],
            "case_lastupdated": case_lastupdated[0]

        }
        return caseid_dict
# Function to handle the streaming response
def generate_response(user_input, profile, length, custom_instructions):

    prompt = summary_prompt.replace("{profile}", profile).replace("{length}", length) + "Final response **should** always be in markdown text. " + custom_instructions
    messages=[
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat.completions.create(model=deployment_name, messages=messages, max_tokens=4096, stream=True)
    # print(response.choices[0].message.content)
    # response = response.choices[0].message.content
    # return response
    for chunk in response:
        if len(chunk.choices) > 0:
            delta = chunk.choices[0].delta
            if delta.content:
                # print("content =",delta.content)
                time.sleep(0.05)
                yield delta.content
        # if 'choices' in chunk:
        #     for choice in chunk['choices']:
        #         print("choice= ", choice)
        #         if 'delta' in choice and 'content' in choice['delta']:
        #             yield choice['delta']['content']


def analyze_sentiment(user_input, custom_instructions):
    prompt = sentiment_prompt + "Final response **should** always be enclosed in <response></response> tags. " + custom_instructions
    messages=[
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat.completions.create(model=deployment_name, messages=messages, max_tokens=1000)
    print("sentiments =",response.choices[0].message.content)
    response = output_parser(response.choices[0].message.content, "sentiment")
    return response

def check_guidelines(user_input, custom_instructions):
    prompt = guidelines_prompt + "Final response **should** always be enclosed in <response></response> tags. " + custom_instructions
    messages=[
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat.completions.create(model=deployment_name, messages=messages, max_tokens=4096)
    print("guidelines =",response.choices[0].message.content)
    response = output_parser(response.choices[0].message.content, "guidelines")
    return response

def wrap(user_input, custom_instructions):
    prompt = wrap_prompt + "Final response **should** always be enclosed in <response></response> tags. " + custom_instructions
    messages=[
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat.completions.create(model=deployment_name, messages=messages, max_tokens=100)
    print("wrap =",response.choices[0].message.content)
    response = output_parser(response.choices[0].message.content, "wrap")
    return response

def recommendation(user_input, custom_instructions):
    prompt = recommendation_prompt + "Final response **should** always be enclosed in <response></response> tags. " +custom_instructions
    messages=[
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat.completions.create(model=deployment_name, messages=messages, max_tokens=2000)
    print("recommendation =",response.choices[0].message.content)
    response = output_parser(response.choices[0].message.content, "recommendation")
    return response

def follow_up(user_input, custom_instructions):
    prompt = follow_up_prompt + "Final response **should** always be enclosed in <response></response> tags. " + custom_instructions
    messages=[
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_input}
    ]
    start = time.time()
    response = client.chat.completions.create(model=deployment_name, messages=messages, max_tokens=1000)
    stop = time.time()
    print("Time taken", stop-start)
    print("follow_up =",response.choices[0].message.content)
    start = time.time()
    response = output_parser(response.choices[0].message.content, "follow_up")
    stop = time.time()
    print("Time taken", stop-start)
    return response

def get_case_id(user_input, custom_instructions):
    prompt = case_id_prompt + "Final response **should** always be enclosed in <response></response> tags. " + custom_instructions
    messages=[
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat.completions.create(model=deployment_name, messages=messages, max_tokens=4096)
    print("caseid =",response.choices[0].message.content)
    response = output_parser(response.choices[0].message.content, "case_id")
    return response