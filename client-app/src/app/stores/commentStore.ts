import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../modules/comments";
import { makeAutoObservable, runInAction } from "mobx"
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl("http://localhost:5000/chat?activityId=" + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch(e => console.log('Error on connection to hub', e));

            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
                comments.forEach(c => c.createdAt = new Date(c.createdAt + 'Z'));
                runInAction(() => this.comments = comments);
            });

            this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
                comment.createdAt = new Date(comment.createdAt);
                runInAction(() => this.comments.unshift(comment));
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(e => console.log('Error stopping hub connection ', e));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke('SendComment', values);
        } catch (e) {
            console.log(e);
        }
    }

}
