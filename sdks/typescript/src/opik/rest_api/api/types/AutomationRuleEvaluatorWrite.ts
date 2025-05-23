/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as OpikApi from "../index";

export type AutomationRuleEvaluatorWrite =
    | OpikApi.AutomationRuleEvaluatorWrite.LlmAsJudge
    | OpikApi.AutomationRuleEvaluatorWrite.UserDefinedMetricPython;

export namespace AutomationRuleEvaluatorWrite {
    export interface LlmAsJudge extends OpikApi.AutomationRuleEvaluatorLlmAsJudgeWrite, _Base {
        type: "llm_as_judge";
    }

    export interface UserDefinedMetricPython
        extends OpikApi.AutomationRuleEvaluatorUserDefinedMetricPythonWrite,
            _Base {
        type: "user_defined_metric_python";
    }

    export interface _Base {
        projectId?: string;
        name: string;
        samplingRate?: number;
        action?: "evaluator";
    }
}
