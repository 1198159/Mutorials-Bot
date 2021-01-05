class Question {
    constructor(ques, ans, correct, sub, rat, pr){
        this.question = ques;
        this.answers = ans;
        this.correctAnswer = correct;
        this.subject = sub;
        this.rating = rat;
        this.passrate = pr;
    }
    answerQuestion(ans){
        return ans === this.correctAnswer;
    }
    subject(){
        return this.subject;
    }

    static removeAllOtherUserReactions(reactions, user, message){
        const userReactions = message.reactions;
        try {
	        for (const reac of userReactions.values()) {
		        if(!(reactions.includes(reac.emoji.name))){
                    reac.remove(user);
                }
	        }
        } catch (error) {
	        console.error('Failed to remove reactions.');
        }
        return true;
    }

}
module.exports = Question;