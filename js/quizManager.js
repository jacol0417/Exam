/**
 * 抽題管理員 (原 QuizPoolManager.kt)
 */
class QuizPoolManager {
    constructor(allTrueFalseQuestions, allMultipleChoiceQuestions) {
        this.allTrueFalseQuestions = [];
        this.allMultipleChoiceQuestions = [];
        this.remainingTrueFalse = [];
        this.remainingMultipleChoice = [];

        // 初始化時，注入題庫並洗牌
        this.updatePools(allTrueFalseQuestions || [], allMultipleChoiceQuestions || []);
    }

    /**
     * 當切換類別時，強制注入新題庫並洗牌 (對應 updatePools)
     */
    updatePools(newTF, newMC) {
        // 使用展開運算子複製陣列，切斷記憶體參照連結
        this.allTrueFalseQuestions = [...newTF];
        this.allMultipleChoiceQuestions = [...newMC];

        // 強制重新洗牌
        this.resetTrueFalsePool();
        this.resetMultipleChoicePool();
    }

    resetTrueFalsePool() {
        this.remainingTrueFalse = this.shuffleArray(this.allTrueFalseQuestions);
    }

    resetMultipleChoicePool() {
        this.remainingMultipleChoice = this.shuffleArray(this.allMultipleChoiceQuestions);
    }

    /**
     * 獲取 20 題（固定前 10 題是非 + 後 10 題選擇）(對應 generate20Questions)
     */
    generate20Questions() {
        const result = [];

        // 1. 安全抽取 10 題是非題
        while (result.length < 10) {
            if (this.remainingTrueFalse.length === 0) {
                this.resetTrueFalsePool();
            }
            if (this.remainingTrueFalse.length > 0) {
                const q = this.remainingTrueFalse.shift(); // 等同於 removeAt(0)
                result.push({ ...q, userAnswer: "" }); // 確保 userAnswer 清空
            } else {
                break;
            }
        }

        // 2. 安全抽取 10 題選擇題
        while (result.length < 20) {
            if (this.remainingMultipleChoice.length === 0) {
                this.resetMultipleChoicePool();
            }
            if (this.remainingMultipleChoice.length > 0) {
                const q = this.remainingMultipleChoice.shift();
                result.push({ ...q, userAnswer: "" });
            } else {
                break;
            }
        }

        return result;
    }

    /**
     * 陣列隨機洗牌工具函式 (原 .shuffled())
     */
    shuffleArray(array) {
        const clone = [...array];
        for (let i = clone.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [clone[i], clone[j]] = [clone[j], clone[i]];
        }
        return clone;
    }
}