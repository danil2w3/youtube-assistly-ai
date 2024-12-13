import ChatBotSessions from "@/components/ui/ChatBotSessions";
import { GET_USER_CHATBOTS } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetUserChatbotsVariables, GetUserChatbotsResponse, Chatbot } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

async function ReviewSessions() {
    const { userId } = await auth();
    if (!userId) {
      return <div>Error: User not authenticated</div>;
    }
  
    const { data } = await serverClient.query({
      query: GET_USER_CHATBOTS,
    });


    if (!data?.chatbotsList) {
      return <div>Error: Chatbots data is unavailable</div>;
    }
  
    const chatbotsByUser = data.chatbotsList.filter((chatbot: Chatbot) => {
      return chatbot.clerk_user_id === userId;
    });

  const sortedChatbotsByUser: Chatbot[] = chatbotsByUser.map((chatbot: Chatbot) => ({
        ...chatbot,
        chat_sessions: [...chatbot.chat_sessions].sort(
            (a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
    }));

    console.log(data?.chatbotsList)


  return (
    <div className="flex-1 px-10">
        <h1 className="text-xl lg:text-3xl font-semibold mt-10">Chat Sessions</h1>
        <h2 className="mb-5">
            Review all the chat sessions the chat bots have had with your customers.
        </h2>

        <ChatBotSessions chatbots={sortedChatbotsByUser} />
    </div>
  )
}

export default ReviewSessions