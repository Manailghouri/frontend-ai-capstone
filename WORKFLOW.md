# AI Workflow Comparison

## Overview

For this assignment, I implemented the same React Settings Form twice using two different AI prompting approaches. The goal was to compare how prompt quality affects the final implementation and the amount of manual review required.

## Round 1 – Vague Prompt

In the first round, I used a very simple prompt asking the AI to create a React settings form without providing any detailed requirements. The AI generated a visually appealing interface, but it also added several unnecessary features such as a Gemini API Key field, preferred model selection, and temperature controls. These were not part of the assignment requirements. The implementation also lacked visible form validation, making it harder to verify correctness.

Because the prompt was vague, I needed to spend more time reviewing the generated output to determine which parts were useful and which should be ignored.

## Round 2 – Precise Prompt

For the second round, I started a new AI session and used a detailed prompt with clear functional requirements, accessibility expectations, validation rules, and a verification step. The generated form contained only the required fields: Full Name, Email Address, Theme Selection, Notification Toggle, and a Save Settings button.

Validation worked correctly by displaying an error message for invalid email addresses. The form structure was cleaner, more focused, and easier to understand.

## Comparison

The second implementation was significantly more accurate because the AI followed the detailed instructions instead of making assumptions. Accessibility also improved through proper labels, cleaner form organization, and better user feedback. The validation handled important edge cases such as empty fields and invalid email addresses.

Although writing the detailed prompt took longer initially, it greatly reduced the time required for reviewing and correcting the generated code. One AI mistake I identified in Round 1 was the inclusion of unnecessary AI configuration fields that were outside the assignment scope. This demonstrated how a precise prompt produces more relevant and maintainable code.