import { runInAction, makeAutoObservable } from "mobx"
import { Activity } from "../modules/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this);
    }

    get activities(){
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(a => {
                a.date = a.date.split('T')[0];
                this.activityRegistry.set(a.id, a);
            });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) =>{
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectActivity = () =>{
        this.selectedActivity = undefined;
        this.editMode = false;
    }

    openForm = (id?:string) =>{
        id ? this.selectActivity(id) : this.cancelSelectActivity();
        this.editMode = true;
    }

    closeForm = () =>{
        this.editMode = false;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();

        try{
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try{
            await agent.Activities.update(activity);
            runInAction(()=>{
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try{
            await agent.Activities.delete(id);
            runInAction(()=>{
                this.activityRegistry.delete(id);

                this.cancelSelectActivity();
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(()=>{
                this.loading = false;
            })
        }
    }
}