# **The GrappleFit Architecture: A Bio-Technical Framework for Adaptive Performance Optimization in Brazilian Jiu-Jitsu**

## **1\. Executive Summary**

The modern combat sports landscape requires a sophisticated convergence of exercise physiology, data science, and software engineering. For the Brazilian Jiu-Jitsu (BJJ) athlete, the primary challenge lies not in the accumulation of training volume, but in the intelligent management of systemic fatigue. The phenomenon known as the "Interference Effect"—where concurrent signaling pathways for endurance and strength adaptations compete—necessitates a dynamic, autoregulated approach to physical preparation. This report outlines the theoretical and technical specifications for "GrappleFit," a bespoke mobile application designed to optimize the training load of BJJ practitioners.

The architecture proposed herein moves beyond static linear periodization. Instead, it employs a **Volume Autoregulation Algorithm (VAA)** that dynamically adjusts resistance training volume in response to the stochastic demands of on-mat grappling sessions. By integrating Rate of Perceived Exertion (RPE) data, daily readiness assessments, and competition timelines, the application serves as a digital performance coach, ensuring that strength training supports, rather than detracts from, technical acquisition.1

Furthermore, the system integrates a robust **Weight Management Module** utilizing linear regression modeling to guide athletes safely through weight descent for International Brazilian Jiu-Jitsu Federation (IBJJF) and Abu Dhabi Combat Club (ADCC) competitions. This is coupled with energy-system-specific cardiovascular protocols—transitioning from aerobic base building (Zone 2\) to anaerobic lactic power intervals—to ensure peak physiological readiness on competition day.3

The following sections detail the physiological mechanisms driving these decisions, the mathematical models underpinning the application's logic, and the complete technical specification for building this system using modern AI-assisted development tools.

## ---

**2\. Physiological Foundations of the Grappling Athlete**

To architect an effective training application, one must first deconstruct the unique physiological demands of Brazilian Jiu-Jitsu. Unlike cyclic sports (running, cycling) or pure power sports (weightlifting), grappling is an acyclic, mixed-energy sport requiring the simultaneous expression of isometric strength, explosive power, and aerobic endurance.

### **2.1 The Interference Effect and Concurrent Training**

The fundamental biological constraint in training BJJ athletes is the "Interference Effect" or the Hickson Effect. At a cellular level, resistance training activates the **mTOR** (mammalian target of rapamycin) pathway, which drives protein synthesis and muscle hypertrophy. Conversely, endurance training—specifically the high-intensity, sustained output of grappling—activates the **AMPK** (AMP-activated protein kinase) pathway, which promotes mitochondrial biogenesis but can inhibit mTOR signaling.1

For the BJJ athlete, this molecular conflict manifests as blunted strength gains and increased risk of overtraining when both modalities are pursued with high volume. Research indicates that without autoregulation, the cumulative fatigue from grappling (which combines eccentric muscle damage, high lactate accumulation, and significant central nervous system stress) renders standard percentage-based lifting programs ineffective or dangerous.2

The "GrappleFit" application addresses this by prioritizing the "Consolidation of Stressors." Rather than treating lifting and grappling as separate entities, the VAA treats them as a unified systemic load. When the app detects a high-load BJJ session (characterized by high-intensity sparring or "Shark Tank" rounds), it automatically dampens the hypertrophy signaling (volume) of the subsequent weight training session while maintaining neural drive (intensity), thereby minimizing the interference effect while preserving neuromuscular adaptations.7

### **2.2 Energy System Demands in BJJ**

BJJ matches, typically ranging from 5 to 10 minutes, are characterized by intermittent high-intensity efforts interspersed with periods of lower-intensity positional control.

#### **2.2.1 The Aerobic Base (Zone 2\)**

Often neglected in combat sports culture, the aerobic system is the engine of recovery. During the low-intensity phases of a match (e.g., maintaining mount, working a slow pass) and the rest periods between matches, the aerobic system replenishes creatine phosphate stores and clears lactate.4

* **Physiological Target:** Improvement in mitochondrial density and cardiac output.  
* **App Logic:** The application prescribes Zone 2 work (60-70% Max Heart Rate) early in the training camp. This serves as the "base" upon which high-intensity performance is built. Without this base, the athlete cannot recover efficiently between explosive bursts.10

#### **2.2.2 The Glycolytic/Lactic System**

This system fuels the sustained, high-intensity scrambles that define match-winning moments—takedown attempts, guard passes, and submission escapes lasting 30-90 seconds.

* **Physiological Target:** Lactate tolerance and buffering capacity.  
* **App Logic:** As the competition date approaches (4-6 weeks out), the application shifts cardio prescriptions to "Threshold Training" and "Cardiac Power Intervals" (e.g., Aerodyne sprints) to mimic the specific metabolic acidosis experienced during a hard roll.11

#### **2.2.3 The Alactic (ATP-PC) System**

Used for maximal explosive movements lasting less than 10 seconds, such as a bridge to escape mount or a sudden shot for a double-leg takedown.

* **Physiological Target:** Neural drive and explosive power.  
* **App Logic:** This is trained primarily through the lifting program (Max Effort days) and specific plyometric drills introduced in the peaking phase.8

### **2.3 Central Nervous System (CNS) Fatigue**

Grappling is uniquely taxing on the CNS due to the constant need for problem-solving under physical duress and the isometric contractions required to immobilize an opponent. CNS fatigue manifests as a reduction in coordination, reaction time, and force production.

* **Risk Mitigation:** The application monitors "Perceived Readiness." If an athlete reports high fatigue or "brain fog" post-training, the VAA reduces the complexity of the prescribed lifts (e.g., swapping a Snatch for a Trap Bar Jump) to reduce neurological demand while maintaining a training stimulus.13

## ---

**3\. The "GrappleFit" Training Architecture**

This section details the core logic and algorithmic processes that define the application's functionality. The system is designed to be "invisible" to the user—they input their status, and the app outputs the optimal dose of training.

### **3.1 The Volume Autoregulation Algorithm (VAA)**

The VAA is the heart of the application. It acts as a heuristic engine, adjusting the planned resistance training load based on the inputs from the BJJ training log.

#### **3.1.1 Logic Parameters**

**Input Variables:**

* $BJJ\_Session\_Status: Boolean (True/False).  
* $BJJ\_Intensity\_Index (1-3):  
  * 1: Technical Drilling / Flow Rolling (RPE 1-4).  
  * 2: Standard Class / Moderate Sparring (RPE 5-7).  
  * 3: Competition Training / "Shark Tank" (RPE 8-10).  
* $User\_Recovery\_Score (1-5): Subjective daily wellness rating.  
* $Planned\_Lift\_Type: (Strength, Hypertrophy, Power).

**Adjustment Heuristics:**

The algorithm utilizes a **Volume Reduction Multiplier (VRM)** applied to the *number of sets* or *total tonnage*. Intensity (weight on the bar) is generally preserved to maintain strength qualities, while volume (metabolic cost) is modulated.2

* **Scenario A: No BJJ Training**  
  * VRM \= 1.0 (Execute planned workout as written).  
  * *Focus:* Maximal adaptation.  
* **Scenario B: BJJ Intensity 1 (Flow)**  
  * VRM \= 1.0 or 0.9.  
  * *Reasoning:* Low-intensity BJJ acts as active recovery and does not significantly interfere with lifting adaptations.  
* **Scenario C: BJJ Intensity 2 (Standard)**  
  * VRM \= 0.75 (Reduce total set volume by 25%).  
  * *Mechanism:* The athlete performs the main compound lifts but reduces accessory volume. For example, 4 sets of squats becomes 3 sets; isolation work (curls, extensions) is optional.  
* **Scenario D: BJJ Intensity 3 (Hard/Comp)**  
  * VRM \= 0.50 (Reduce total set volume by 50%).  
  * *Mechanism:* The "Minimum Effective Dose" approach. The athlete performs only the primary lift (e.g., 2 sets of heavy Deadlifts) and skips all accessories. The goal is to stimulate the nervous system without depleting glycogen stores further.7

#### **3.1.2 The "Rule of Thumb" for Concurrent Days**

The application enforces a scheduling logic for users training twice per day.

* **Sequence:** If possible, the app advises Lifting \-\> BJJ for hypertrophy phases (to prioritize muscle growth signals) or BJJ \-\> Lifting for pre-competition phases (to prioritize skill acquisition when fresh).  
* **Spacing:** A minimum 6-hour gap is recommended to allow AMPK signaling to return to baseline before stimulating mTOR, though the app adapts if this is not possible by reducing the RPE targets of the second session.5

### **3.2 Weight Management Module: The Linear Descent Model**

Weight cutting is a critical and potentially dangerous component of combat sports. The "GrappleFit" app utilizes a **Linear Descent Model** with safety buffers to guide the athlete to their target weight class.

#### **3.2.1 Mathematical Model for Weight Loss**

The application calculates a "Daily Loss Target" (DLT) based on a linear regression from the current date to the competition date, minus a "Water Cut Buffer."

![][image1]  
Where:

* ![][image2] \= The official weight limit (e.g., 88.3 kg for IBJJF Medium Heavy).  
* ![][image3] \= The amount of weight reserved for the acute water cut (typically 5-8% of body mass).  
* ![][image4] \= Days until weigh-in.

**Safety Logic:**

* **Buffer Calculation:** The app calculates the maximum safe acute water cut based on the weigh-in type.  
  * *Day-Before Weigh-in (ADCC/MMA):* Max acute cut \= 8% of body weight.16  
  * *Same-Day Weigh-in (IBJJF):* Max acute cut \= 3-5% of body weight (due to limited rehydration time).18  
* **Red Flag Trigger:** If the required daily caloric deficit exceeds 1000 kcal or if the projected acute cut exceeds the safety percentage, the app triggers a "Category Warning," advising the athlete to move up a weight class.18

#### **3.2.2 The Acute Water Cut Protocol**

In the final week (Week 0), the app switches from the Linear Descent Model to a specific **Water Manipulation Schedule**.20

* **Day \-6 to \-4 (Water Loading):** App notifies user to consume 2.0 gallons (7.5L) of water daily. Sodium intake is high. This suppresses the hormone aldosterone, encouraging fluid flushing.  
* **Day \-3:** Water reduced to 1.0 gallon. Sodium reduced to moderate.  
* **Day \-2:** Water reduced to 0.5 gallon. Sodium reduced to zero.  
* **Day \-1:** Water intake limited to sipping. No food after 6 PM.  
* **Day 0 (Weigh-In):** Rehydration protocol activates immediately post-weigh-in.

### **3.3 Cardiovascular Periodization Logic**

The cardio prescription is driven strictly by the Competition\_Date variable. The app divides the training macrocycle into three distinct phases.

#### **3.3.1 Phase 1: Aerobic Base (8+ Weeks Out)**

* **Protocol:** Zone 2 Steady State.  
* **Frequency:** 3 sessions per week.  
* **Logic:** Long, slow duration (45-60 mins) at 60-70% Max HR.  
* **Modality:** Rower, Air Bike, or Jogging.  
* **Goal:** Increase cardiac output and capillary density. "Build the engine".4

#### **3.3.2 Phase 2: Threshold & Power (8-3 Weeks Out)**

* **Protocol:** Aerodyne Sprints / Tabata.  
* **Frequency:** 2-3 sessions per week.  
* **Logic:** High intensity intervals.  
  * *Aerodyne Protocol:* 10s Sprint / 50s Cruise, then 20s/40s, then 30s/30s. Repeat for 15-20 minutes.11  
  * *Concept 2 Rower:* 500m repeats with 1:1 work:rest ratio.  
* **Goal:** Increase VO2 max and lactate buffering.

#### **3.3.3 Phase 3: Taper & Specificity (2 Weeks Out)**

* **Protocol:** Alactic Sprints & Recovery.  
* **Frequency:** 2 sessions per week.  
* **Logic:** Very short bursts (\<10s) with full recovery, or pure active recovery.  
* **Goal:** Keep the nervous system primed without inducing metabolic fatigue.3

## ---

**4\. Supplemental Exercise Prescription**

Based on the user's provided workout history ("Casey Workout History" 23), which includes **Trap Bar Deadlifts, Zercher Squats, Pull-ups, and KB Swings**, there are specific "armor-building" gaps that need to be filled. The current routine is strong on posterior chain and core, but lacks specific structural reinforcement for the neck, grip, and rotational stability required for longevity in BJJ.

### **4.1 Neck Strengthening (The "Anti-Concussion" Protocol)**

BJJ places immense torque on the cervical spine (guillotines, stacking, takedowns). Neck strength is the primary defense against concussions and nerve impingement.

* **Exercise 1: Iron Neck Rotations (or Banded Rotations)**  
  * *Execution:* Attach a resistance band to a rig and loop it around the forehead. Rotate the head left and right against tension ("No" motion), then up and down ("Yes" motion).  
  * *Protocol:* 3 sets of 20 controlled reps per side.  
  * *Rationale:* Strengthens the deep cervical flexors and extensors in a rotational plane, essential for resisting chokes.24  
* **Exercise 2: Supine Neck Flexion (The "Nod")**  
  * *Execution:* Lie on a bench with head hanging off. Tuck chin to chest.  
  * *Protocol:* 3 sets of 15-25 reps. Start with bodyweight, progress to holding a small plate (2.5-5lbs) on the forehead.  
  * *Rationale:* Directly targets the sternocleidomastoid, crucial for maintaining posture when an opponent pulls on the head.26

### **4.2 Grip & Forearm Endurance (The "Gi-Proof" Protocol)**

The user is performing standard pull-ups, which are excellent for general strength. However, BJJ requires "crushing" and "holding" strength (isometric) more than dynamic pulling.

* **Exercise 1: Gi/Towel Pull-Ups**  
  * *Execution:* Drape a BJJ gi or thick towel over a pull-up bar. Grip the fabric (vertical grip) and perform pull-ups or hangs.  
  * *Protocol:* 3 sets of Max Reps or Max Time Hang.  
  * *Rationale:* Trains the thumb-less grip and flexor digitorum profundus specifically for collar/sleeve controls.27  
* **Exercise 2: Plate Pinches**  
  * *Execution:* Pinch two 10lb (or 5kg) plates together with smooth sides facing out. Hold for time.  
  * *Protocol:* 3 sets of 30-45 seconds.  
  * *Rationale:* Develops thumb adductor strength, vital for maintaining "pistol grips" and preventing grip breaks.28

### **4.3 Anti-Rotation & Core Stability**

While the user performs Zercher Squats (excellent for anterior core), BJJ involves resisting rotational forces (e.g., stopping a guard pass or a hip toss).

* **Exercise 1: Pallof Press**  
  * *Execution:* Stand perpendicular to a cable column. Hold handle at chest height. Press out and hold, resisting the cable's pull to rotate the torso.  
  * *Protocol:* 3 sets of 10 reps with a 3-second isometric hold at extension.  
  * *Rationale:* Builds lateral core stability to resist twisting forces during scrambles.1  
* **Exercise 2: Sandbag Get-Ups**  
  * *Execution:* Similar to a Turkish Get-Up, but holding a sandbag on one shoulder.  
  * *Protocol:* 5 reps per side.  
  * *Rationale:* "Specific Physical Preparedness" (SPP). This mimics the exact mechanics of standing up from the bottom position while bearing an opponent's weight.8

## ---

**5\. Periodization & Peaking Strategies (The 8-Week Camp)**

The application will automatically generate this timeline based on the user's input of a competition date. This model assumes an 8-week preparation cycle.29

### **Week 8-6: General Physical Preparedness (GPP) & Hypertrophy**

* **Goal:** Build tissue tolerance and aerobic capacity.  
* **Lifting:** 3-4 days/week. Moderate Intensity (70-75% 1RM), Higher Volume (4x8-10). Options: Upper/Lower split or Full Body.
* **Cardio:** Zone 2 focus (3x/week).
* **BJJ:** Moderate intensity, focus on skill acquisition.
* **Autoregulation:** Low sensitivity. User encouraged to lift even if tired.
* **Full Body Option:** Trap Bar Deadlift, Bench Press, Barbell Row, KB Swing + all supplementals. Ideal for athletes who can only lift 2x/week.

### **Week 5-3: Strength & Threshold**

* **Goal:** Maximize force production and lactate threshold.  
* **Lifting:** 3 days/week. High Intensity (80-90% 1RM), Moderate Volume (3-5 sets x 3-5 reps). Options: Upper/Lower split or Full Body.
* **Cardio:** Aerodyne Intervals (2x/week).
* **BJJ:** High intensity. "Shark tanks" and hard sparring.
* **Autoregulation:** Moderate sensitivity. If BJJ is "Hard," lifting volume is cut by 25%.
* **Full Body Option:** Trap Bar Deadlift, Bench Press, Weighted Pull-Up + grip and neck supplementals. Consolidates load into fewer sessions.

### **Week 2: Power & Specificity (Peaking)**

* **Goal:** Conversion of strength to power; Sharpening.  
* **Lifting:** 2 days/week. Explosive movements (Jumps, Throws, Speed Squats). Low weight (50-60%), Max Velocity. Options: Explosive day or Full Body Power.
* **Cardio:** Alactic Sprints (short duration, full recovery).
* **BJJ:** Intensity remains high, but volume (rounds) decreases.
* **Autoregulation:** High sensitivity. Any sign of injury or extreme fatigue triggers a "Rest Day" recommendation.
* **Full Body Power Option:** Trap Bar Deadlift, Speed Squat, Plyo Push-Up, Box Jump, KB Swing + neck work. Combines all explosive work into one session.

### **Week 1: Taper (Competition Week)**

* **Goal:** Dissipate fatigue, supercompensation.  
* **Lifting:** 1 session early in the week (e.g., Monday). Very low volume (2x2 @ 70%). "Priming" workout only.  
* **Cardio:** None (except for weight cutting purposes).  
* **BJJ:** Drilling only. No live sparring after Tuesday.  
* **Weight:** Water cut protocol initiates.3

## ---

**6\. Technical Implementation Specification**

This section outlines the software architecture required to build "GrappleFit." The system is designed as a **Progressive Web App (PWA)** or **React Native** mobile app, utilizing a **Supabase** backend for rapid development and real-time data syncing.

### **6.1 Entity Relationship Diagram (ERD) & Database Schema**

The database must handle complex relational data between users, competitions, workouts, and the logic logs. We utilize PostgreSQL (via Supabase).

**Core Tables:**

1. **users**  
   * id (UUID, PK)  
   * belt\_rank (Enum: White, Blue, Purple, Brown, Black)  
   * current\_weight (Float)  
   * fatigue\_score (Int 1-10)  
2. **competitions**  
   * id (UUID, PK)  
   * user\_id (FK)  
   * name (String)  
   * date (Date)  
   * target\_weight\_class (Float)  
   * weigh\_in\_type (Enum: DayBefore, SameDay)  
3. **exercises**  
   * id (UUID, PK)  
   * name (String) (e.g., "Trap Bar Deadlift")  
   * category (Enum: Push, Pull, Legs, Neck, Grip, Cardio)  
   * is\_supplemental (Boolean) \- *Used to flag neck/grip exercises.*  
4. **training\_logs**  
   * id (UUID, PK)  
   * date (Date)  
   * bjj\_intensity (Enum: Rest, Flow, Standard, Hard)  
   * volume\_modifier (Float) \- *The calculated multiplier (0.5, 0.75, 1.0).*  
   * rpe\_lifting (Int)  
5. **workout\_plans**  
   * id (UUID, PK)  
   * phase (Enum: GPP, Strength, Power, Taper)  
   * week\_number (Int)  
   * base\_volume\_sets (Int)

### **6.2 State Management & Autoregulation Logic**

The frontend (React/React Native) will use **Zustand** for global state management. The core logic resides in a "Coach Store" that computes the daily prescription.

**State Flow:**

1. **User Check-in:** User opens app \-\> Modal asks: "Did you train BJJ today?"  
2. **Input Processing:**  
   * If Yes \-\> "How hard?" (Slider 1-10 or Enum).  
   * If Hard (8-10) \-\> Dispatch SET\_VOLUME\_MODIFIER(0.5).  
   * If Moderate (5-7) \-\> Dispatch SET\_VOLUME\_MODIFIER(0.75).  
3. **Workout Rendering:**  
   * The workout component fetches the base\_volume\_sets from workout\_plans.  
   * Calculation: Display\_Sets \= Math.floor(base\_volume\_sets \* volume\_modifier).  
   * *Visual Feedback:* The UI highlights the reduced sets in amber with a message: *"Volume reduced to prioritize BJJ recovery."*

### **6.3 Weight Tracker Logic Implementation**

The weight tracker is not just a log; it is a **Decision Support System**.

* **Glide Path Calculation:**  
  On app init, generate a linear array of target weights from Start\_Date to Comp\_Date.  
* **Daily Variance Check:**  
  Each morning, compare Current\_Weight to Target\_Weight\_For\_Day.  
  * If Variance \> \+2% \-\> Suggest caloric reduction (e.g., "Cut carbs by 50g today").  
  * If Variance \< \-1% \-\> Suggest maintenance or slight increase ("Eat normally").  
* **Water Cut Trigger:** At Comp\_Date \- 7 days, switch UI to "Water Load Mode." Display the gallon jug icons corresponding to the protocol defined in Section 3.2.2.30

## ---

**7\. Claude CLI Instruction Manual**

This section provides the exact prompt engineering and file structure instructions required to build this application using the **Claude CLI** or an AI-IDE like **Cursor**. This guide is written to be saved as a INSTRUCTIONS.md file in the project root.

### ---

**filename: INSTRUCTIONS.md**

# **GrappleFit Application Build Instructions**

## **1\. Project Context & Persona**

You are an expert Senior Full-Stack Engineer and Sports Scientist specializing in combat sports performance. You are building "GrappleFit," a React Native (Expo) application with a Supabase backend. The app's core value proposition is **Autoregulation**: adjusting lifting volume based on BJJ fatigue to prevent injury and optimize performance.

## **2\. Tech Stack Specification**

* **Frontend:** React Native (Expo SDK 50+), TypeScript, NativeWind (Tailwind CSS).  
* **Backend:** Supabase (PostgreSQL, Authentication, Edge Functions).  
* **State Management:** Zustand (for lightweight, transient state like "Daily Readiness").  
* **Navigation:** Expo Router (File-based routing).  
* **UI Component Library:** React Native Paper or Tamagui (for consistent, accessible UI elements).

## **3\. Core Feature Requirements**

### **Feature A: The Daily Readiness Check-In**

**Logic:**

Upon app launch, check if a log exists for current\_date. If not, trigger a Modal.

**Questions:**

1. "Did you train Jiu-Jitsu today?" (Boolean)  
2. (If Yes) "Rate the intensity." (Selection: Flow/Drill, Standard Class, Competition/Shark Tank).  
3. "Any new aches/injuries?" (Multi-select: Neck, Knee, Lower Back, Elbow).

**Outcome:**

* Store inputs in daily\_logs table.  
* Calculate volume\_modifier:  
  * Competition/Shark Tank \= 0.5  
  * Standard Class \= 0.75  
  * Flow/Drill \= 1.0  
* If "Knee" injury is selected, automatically swap "Squats" for "Box Squats" or "Sled Work" in the daily workout view.

### **Feature B: The Weight Descent Module**

**Logic:**

* Create a Competition object with target\_weight and date.  
* Implement a Linear Regression utility function: calculateTargetWeight(startDate, startWeight, targetDate, targetWeight).  
* **Visuals:** Render a Line Chart (using react-native-chart-kit) showing:  
  1. The "Ideal Glide Path" (Linear descent).  
  2. The "Actual Weight" (User logs).  
  3. The "Safety Buffer Zone" (Red zone if weight is \>5% over target within 7 days).  
* **Water Cut Mode:** If days\_until\_comp \<= 7, replace the chart with a "Hydration Checklist" (e.g., "Drink 2 Gallons Today").

### **Feature C: The Workout Generator**

**Logic:**

* Fetch the base\_workout for the current phase (e.g., Strength Phase).  
* Apply volume\_modifier to the sets.  
* **Supplemental Injection:** Automatically append 2 "Armor Building" exercises to every workout based on the user's gaps:  
  * If Upper Body Day: Add "Gi Pull-ups" and "Neck Rotations".  
  * If Lower Body Day: Add "Pallof Press" and "Sled Drag".

### **Feature D: Cardio Prescription**

**Logic:**

* Check days\_until\_comp.  
* If \> 60 days: Display "Zone 2 Timer" (Continuous count up, Green background).  
* If 30-60 days: Display "Aerodyne Interval Timer" (10s High / 50s Low loop).  
* If \< 14 days: Display "Alactic Sprint Timer" (6s Max Effort / 90s Rest).

## **4\. Database Schema (Supabase SQL)**

*Copy and paste the SQL block below into the Supabase SQL Editor:*

SQL

\-- Users and Profile  
create table public.profiles (  
  id uuid references auth.users not null primary key,  
  belt\_rank text check (belt\_rank in ('White', 'Blue', 'Purple', 'Brown', 'Black')),  
  competition\_weight\_class float  
);

\-- Daily Logs (The Brain)  
create table public.daily\_logs (  
  id uuid default gen\_random\_uuid() primary key,  
  user\_id uuid references public.profiles(id),  
  date date default current\_date,  
  bjj\_intensity text, \-- 'Flow', 'Standard', 'Hard'  
  volume\_modifier float default 1.0,  
  weight\_log float  
);

\-- Exercises Library  
create table public.exercises (  
  id uuid default gen\_random\_uuid() primary key,  
  name text not null,  
  category text, \-- 'Push', 'Pull', 'Legs', 'Neck', 'Grip'  
  is\_supplemental boolean default false  
);

\-- Workouts  
create table public.workouts (  
  id uuid default gen\_random\_uuid() primary key,  
  phase text, \-- 'Hypertrophy', 'Strength', 'Peaking'  
  exercises jsonb \-- Array of exercise objects with base sets/reps  
);

## **5\. Step-by-Step Build Prompt (for CLI)**

*Use these prompts in sequence to build the app:*

**Prompt 1 (Scaffold):**

"Initialize a new Expo project named GrappleFit using TypeScript and Expo Router. Install NativeWind, Zustand, and Supabase JS client. Set up the folder structure with /app, /components, /store, and /services."

**Prompt 2 (Readiness Logic):**

"Create a Zustand store named useTrainingStore. It should hold dailyReadiness and volumeModifier. Implement a function calculateModifier(intensity) that returns 0.5, 0.75, or 1.0 based on the input."

**Prompt 3 (UI Implementation):**

"Build a DailyCheckInModal.tsx component. It should appear if the user hasn't logged today. Use a Slider for intensity. On save, update the Zustand store and Supabase daily\_logs table."

**Prompt 4 (Weight Logic):**

"Create a WeightTracker.tsx screen. Implement the linear regression math to show expected vs actual weight. Add a toggle for 'Water Cut Mode' that activates automatically 7 days before the competition date stored in the profile."

## ---

**8\. Conclusion**

The "GrappleFit" system offers a comprehensive solution to the complex problem of concurrent training in combat sports. By automating the volume regulation process, the application removes the emotional bias from training—preventing the common "grind mindset" error where athletes push through fatigue and sustain injuries.

The integration of specific physiological protocols—Linear Weight Descent, Phase-Specific Cardio, and Supplemental "Armor" Exercises—ensures that the user is not just a general fitness enthusiast, but a specialized grappling athlete. The technical architecture provided ensures a scalable, responsive, and data-driven user experience that aligns with the highest standards of modern sports science and software engineering.

The user is advised to begin the "Base Building" phase immediately, inputting their next competition date to initialize the periodization engine. The "Missing Link" exercises (Neck and Grip) should be integrated into the very first workout cycle to begin building structural resilience.24

#### **Works cited**

1. The Definitive Guide to Strength Training for BJJ (Part 2\) \- Reddit, accessed February 12, 2026, [https://www.reddit.com/r/bjj/comments/18443i9/the\_definitive\_guide\_to\_strength\_training\_for\_bjj/](https://www.reddit.com/r/bjj/comments/18443i9/the_definitive_guide_to_strength_training_for_bjj/)  
2. How To Balance Lifting and BJJ \- BJJ Strong, accessed February 12, 2026, [https://www.bjjstrongonline.com/blog/how-to-balance-lifting-and-bjj](https://www.bjjstrongonline.com/blog/how-to-balance-lifting-and-bjj)  
3. The 5 Rules of Peaking Before a Tournament (Plus a 6-Week Plan) \- Breaking Muscle, accessed February 12, 2026, [https://breakingmuscle.com/the-5-rules-of-peaking-before-a-tournament-plus-a-6-week-plan/](https://breakingmuscle.com/the-5-rules-of-peaking-before-a-tournament-plus-a-6-week-plan/)  
4. "Just Roll More" Is TERRIBLE Advice for Improving BJJ Cardio \- BJJ Strong, accessed February 12, 2026, [https://www.bjjstrongonline.com/blog/how-to-improve-bjj-cardio](https://www.bjjstrongonline.com/blog/how-to-improve-bjj-cardio)  
5. Effects of Consecutive Versus Non-consecutive Days of Resistance Training on Strength, Body Composition, and Red Blood Cells \- PMC, accessed February 12, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC6015912/](https://pmc.ncbi.nlm.nih.gov/articles/PMC6015912/)  
6. An Evidenced-Based Training Plan for Brazilian Jiu-Jitsu \- CIE-DC, accessed February 12, 2026, [https://www.cie-dc.com/uploads/1/3/2/9/132987652/bjj4.pdf](https://www.cie-dc.com/uploads/1/3/2/9/132987652/bjj4.pdf)  
7. Full Body Jiu Jitsu Workout: Dynamic Effort Day | Westside Barbell, accessed February 12, 2026, [https://www.westside-barbell.com/blogs/the-blog/full-body-jiu-jitsu-workout-dynamic-effort-day](https://www.westside-barbell.com/blogs/the-blog/full-body-jiu-jitsu-workout-dynamic-effort-day)  
8. BJJ Strength and Conditioning: Building Power, Endurance, and Resilien | Westside Barbell, accessed February 12, 2026, [https://www.westside-barbell.com/blogs/the-blog/bjj-strength-and-conditioning-building-power-endurance-and-resilience](https://www.westside-barbell.com/blogs/the-blog/bjj-strength-and-conditioning-building-power-endurance-and-resilience)  
9. A Generalized Breakdown of Cardio Physiology For All the "How to Improve BJJ Cardio" Questions and What You Can Do to Improve \- Reddit, accessed February 12, 2026, [https://www.reddit.com/r/bjj/comments/soi5fo/a\_generalized\_breakdown\_of\_cardio\_physiology\_for/](https://www.reddit.com/r/bjj/comments/soi5fo/a_generalized_breakdown_of_cardio_physiology_for/)  
10. How to Periodize Your Brazilian Jiu-Jitsu Training for Peak Performance \- Pedestal, accessed February 12, 2026, [https://www.pedestal.fit/blog/how-to-periodize-your-bjj-training](https://www.pedestal.fit/blog/how-to-periodize-your-bjj-training)  
11. Airdyne Conditioning Workout for BJJ: Test Your Fitness, accessed February 12, 2026, [https://grapplersperformx.com/blog/airdyne-conditioning-workout-for-bjj-test-your-fitness](https://grapplersperformx.com/blog/airdyne-conditioning-workout-for-bjj-test-your-fitness)  
12. Best Conditioning Methods for Brazilian Jiu-Jitsu: Build Stamina & Explosiveness \- YouTube, accessed February 12, 2026, [https://www.youtube.com/watch?v=rKYjGQcbCAA](https://www.youtube.com/watch?v=rKYjGQcbCAA)  
13. PERCENT TRAINING: WHAT IS IT REALLY? \- Westside Barbell, accessed February 12, 2026, [https://www.westside-barbell.com/blogs/the-blog/percent-training-what-is-it-really](https://www.westside-barbell.com/blogs/the-blog/percent-training-what-is-it-really)  
14. The Definitive Guide to Strength Training for BJJ (Part 1\) \- Reddit, accessed February 12, 2026, [https://www.reddit.com/r/bjj/comments/18444zt/the\_definitive\_guide\_to\_strength\_training\_for\_bjj/](https://www.reddit.com/r/bjj/comments/18444zt/the_definitive_guide_to_strength_training_for_bjj/)  
15. What's easier, lifting and doing BJJ in the same day or training BJJ twice in the same day? \- Reddit, accessed February 12, 2026, [https://www.reddit.com/r/bjj/comments/1bcxncw/whats\_easier\_lifting\_and\_doing\_bjj\_in\_the\_same/](https://www.reddit.com/r/bjj/comments/1bcxncw/whats_easier_lifting_and_doing_bjj_in_the_same/)  
16. ACUTE WEIGHT MANAGEMENT IN COMBAT SPORTS: PRE WEIGH-IN WEIGHT LOSS, POST WEIGH-IN RECOVERY AND COMPETITION NUTRITION STRATEGIES, accessed February 12, 2026, [https://www.gssiweb.org/docs/default-source/sse-docs/reale\_sse\_183\_v3.pdf?sfvrsn=2](https://www.gssiweb.org/docs/default-source/sse-docs/reale_sse_183_v3.pdf?sfvrsn=2)  
17. How To Safely Cut Weight in Combat Sports: Smart Strategies for Peak Performance, accessed February 12, 2026, [https://www.gatorade.com/resources/how-to-safely-cut-weight-combat-sports](https://www.gatorade.com/resources/how-to-safely-cut-weight-combat-sports)  
18. Weight Cutting: A Safe Guide for Combat Athletes \- BodySpec, accessed February 12, 2026, [https://www.bodyspec.com/blog/post/weight\_cutting\_a\_safe\_guide\_for\_combat\_athletes](https://www.bodyspec.com/blog/post/weight_cutting_a_safe_guide_for_combat_athletes)  
19. Cutting Weight for Jiu Jitsu Competitions: The Ultimate Guide, accessed February 12, 2026, [https://www.jiujitsubrotherhood.com/blogs/blog/cut-weight-jiu-jitsu-competitions](https://www.jiujitsubrotherhood.com/blogs/blog/cut-weight-jiu-jitsu-competitions)  
20. Weight Cutting For BJJ | JiuJitsu.com, accessed February 12, 2026, [https://jiujitsu.com/blogs/jiujitsu/weight-cutting-for-bjj](https://jiujitsu.com/blogs/jiujitsu/weight-cutting-for-bjj)  
21. Weight cutting hacks: how to lose weight like a wrestler | by Joe Heyob | Medium, accessed February 12, 2026, [https://medium.com/@heyobjoe/weight-cutting-hacks-lose-10-lbs-in-5-days-and-feel-just-fine-1a858f7582fd](https://medium.com/@heyobjoe/weight-cutting-hacks-lose-10-lbs-in-5-days-and-feel-just-fine-1a858f7582fd)  
22. Learning to Taper for a BJJ Comp, accessed February 12, 2026, [https://www.renegadebjj.com.au/posts/learning-to-taper-for-a-bjj-comp](https://www.renegadebjj.com.au/posts/learning-to-taper-for-a-bjj-comp)  
23. Casey Workout History, [https://drive.google.com/open?id=19QzM3zBWCMt8gR4IHP6lQXt5\_wqHzBngJleaBJ9GPgI](https://drive.google.com/open?id=19QzM3zBWCMt8gR4IHP6lQXt5_wqHzBngJleaBJ9GPgI)  
24. Eight Weeks of Self-Resisted Neck Strength Training Improves Neck Strength in Age-Grade Rugby Union Players: A Pilot Randomized Controlled Trial \- PMC, accessed February 12, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC9214908/](https://pmc.ncbi.nlm.nih.gov/articles/PMC9214908/)  
25. Neck Strength In Grappling: Building Resilience Against Chokes \- Evolve MMA, accessed February 12, 2026, [https://evolve-mma.com/blog/neck-strength-in-grappling-building-resilience-against-chokes/](https://evolve-mma.com/blog/neck-strength-in-grappling-building-resilience-against-chokes/)  
26. How to Build a Bigger and Stronger Neck for BJJ, accessed February 12, 2026, [https://novakikbjj.com/blogs/blog-post/how-to-build-a-bigger-and-stronger-neck-for-bjj](https://novakikbjj.com/blogs/blog-post/how-to-build-a-bigger-and-stronger-neck-for-bjj)  
27. How to Build Grip Strength for BJJ \- Breaking Muscle, accessed February 12, 2026, [https://breakingmuscle.com/how-to-build-grip-strength-for-bjj/](https://breakingmuscle.com/how-to-build-grip-strength-for-bjj/)  
28. The Ultimate Grip Strength Guide for Grapplers, accessed February 12, 2026, [https://www.bjjstrongonline.com/blog/the-ultimate-grip-strength-guide-for-grapplers](https://www.bjjstrongonline.com/blog/the-ultimate-grip-strength-guide-for-grapplers)  
29. How to train for a BJJ competition: 8 weeks competition training program, accessed February 12, 2026, [https://www.bjjee.com/articles/how-to-train-for-a-bjj-competition-8-weeks-competition-training-program/](https://www.bjjee.com/articles/how-to-train-for-a-bjj-competition-8-weeks-competition-training-program/)  
30. The Perfect Cursor AI setup for React and Next.js \- Builder.io, accessed February 12, 2026, [https://www.builder.io/blog/cursor-ai-tips-react-nextjs](https://www.builder.io/blog/cursor-ai-tips-react-nextjs)  
31. Claude Memory Setup Guide | MCP Servers \- LobeHub, accessed February 12, 2026, [https://lobehub.com/mcp/randall-gross-claude-memory-mcp](https://lobehub.com/mcp/randall-gross-claude-memory-mcp)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAvCAYAAABexpbOAAAKVElEQVR4Xu3dZ5BkVRXA8WNWTGXOugpmXRWzfkEwloqWOYFiKsTSMgcMLApmxSzGWgFzVsxhwQAIZjGWoSgTgumDoGJZ+v5177Hv3O2J+2Zmp+f/q7r13r3dPfNe92y/szecFyFJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJG91NhnKHru3idXuxur3QUM43lAvW+vlrG3XaN5Jv1m2e40WGcuGhXCDKebFNPMY55nmvJ46F9zo/k4vWLceeWwqfy1o4qm9ovLVvkCRJK0eA8qG+sfrvlDpBQzpnKA9s6hvB57t6f45/HcrtmjoB0JFNfT3deSi/7tr6498+lCt2bavp731DdaMoxytJkkbwgqFcqm+s+mCgrz+3q+/utg7lvK6tP6czYm5v402b/dW071Ce3Dd26An9Q9fWHj89bqc19bXw9b6h8ce+QZIkLR/Dayf2jY02GLj+UM4dyjVq/dXNYxsFPYKHdm3tOdKbRsBzQNP22mZ/Nd1/KNv6xg69m+3xHtPV+SzpMV1LNxzKXfrGar+hPLRvlCRJS0ew9v26nU8GA3cfytFDOX0od6pta9XzNCbOZ8uUtnTSUN44lMNr/WnNY6vtAUM5rG+cIo+Xz21LU79V3a6Hj/QNjb4HU5IkLQO9MWf3jZ282D61bj8xlMcP5Ru1vlau2jdUtxnKa+YpOTG/9Z/YOUCl7XJDuXmtc67vjTJpfqE5WP/qG1bgcTE53uOHcnJTf37zvBafyR5DOaWp44i6BYsmvtDU53NwzO1h3d7Vl4pAfj7PiBLwS5KkFeBCv9icKZ7z+qZOIPGumL4KkUnmuPqc1olr1+3V6rYdurtB3eZjbYDGMc43x265OJ/Ld20/H8ora8H+UVaR7vX/Z0zkOeJFzX67EANX6erX6erTLKeHbUdMAk/q/fA0AdsdY/KcSzaPpUsP5W8xWWlK/W5NHfm5XHYol4j5P9vj+oYGn/Nv+kZJkrQ45moxn2uxVBX/iLlBCj0yn2vqiQCHgIygI1dU7hnl4k8QQg/Mp6LM06Ini+cSIB1Yn8NFnSCNSfW3H8o9h/LTKMacuE5wc9+u7bNReg0TQcq035nnuCXKcWZgs20oV4hJT9cz65aAieewSOAWtW0hywnYWmdGec9a9GrxuzlmhngJeJmDeGzznPtFCVbbeuvUmHwuvJ7Vs/vEzj2UBKsHdW09jnkp5yZJWiIu5HxJcyHPHFWZfytzU2VOqvZ/4rMoz5/zpvR5yJA5uvqL2O6OC/wJfeMUv+vqBBVMMm/xHuQkfYYhM9B6bN3yeHuxflKz/5coQ3+vqPVD6vZVQ/lA3f9n3Y7hjJj0pKX3xNzePnrg8thTe47Ic9gaZREGk+5/W9seMZQf1X3+bng/+B2LWWrARqDdmjYcSXCMs6IMnz6k1vMYQQ9hvsdZT/Sm8TPyc2G+IsH7NKyo3btv7BCwndA3SpJ2DXN62iEc5vTQC9H6VVefVVxoHt3V2+Ev3qeNlocMLxnKg/vGFbpylKCAoIceqF9GCfx/HyXwunGtJ4KI1A6V8drs2SJI42eCQIJeojFsiZXNPevPkV6zN8fkPfzxUJ4QJdAhCGJLEM+/JXooX1aftxDeJ4Ykx/CdumX4GjnnkB435s2BYJxVnKkNzjn2XA3M+ZKnj/Qv0xAEL+ZnsXPPoCRpF/Hl2g6xfDvm5nZiqGez4CLT5hqjnj1vOKXZ30h+EOOuKlyot7Wf30Uw02qTvOZjvCbfZ+ZPjYljpTdrueY7x5wTlwFmG5yC4dL1kMeTOP6ce8j+ju6xto6213HaHDgwXLqU+XmfCQM2SRrdp2My/MMXNXOOmL+S5lu9Nou4yLyz7n8ySi/EzWr9unW7EXFerIzcrNqgezPqh2j7+lLQC7fUYJQeUgM2SRoZiUIPr/tfijIPJ79sGUpbL6SU2BXMM2oLKRv2jUlesWk47xOjzFPj4vS1KL0zd40yJLZRefHUWmJahX9zkjSyFw7lDXX/lnXLly1zWb5Y6+k5XX2lrtQ3TLEeX/j8zh/GZJJ5m4csh8LWwkI30s68XX3pJ9e3FnovmWhusay0THNQLPw3J0lagYdFCcy+2rTxZZsTmBPDpfdp6u3qSfJpUd+raWPidusydcvPYVLzQsNUrD58X1Nv5z31Oa+mYT7OUQuU+XDeTIAnzQQWy0OWc33y8Vw9es2YvD85J6vNaUUqCdCLxxyodr4UeciYK5c/awxePLWWnh7+zUnS6G4bZRVoO1l82pctq+ISQQUynQHz3liN97xaz3lg/ByCLVbVgeFX0kQslLphW5RgjzxSZLbP1ATHRcl5lSvg2tWcYyGVwb+b+sGxcB4yju3lUVZIgiHXw4bylCjvJ3nIyGn18JjktDo1JvmumHR/Ni+MyXvOysl96v5Y+NnzTSSXxsZ/iqZ9h0iSdsG01XDT7ht5Vt2Shym/jAlYCDr6NAAENHhL3ba9dTx3W5RM671n1+1Lo/TAEUCR54r9nPSfAVublmAsJBMlwErTevMYNu57D5kjRy4vetoIyvK9whOb/etF6X1Lh8QkXxVz5Hh91sfsYTspds6nNmv+HOXvkmz+BNDnhbdIWi8fDgM2SVo35Nt6Vt0/YigvHspXap0ApU1vwP+w3xSTVWUEbOTXYliQG0e/PXZO9wCCOH4H87HopSLnGUEfgVzO6/pulIAwA7f18O4ox5VZ9DmfI6Mc96OG8vHajl80++A8GGoFj2W6jVzU8OVYeD7aShwaa3tj8/VAjrQ+SCBlzbldm1YfwXPbUy1J2g3RO0cwxgrLsd0rSi8Uw4rT5pVpOnrXMrnqrGJ4vg/YGLrv27T6eM8/1jdKknYv9KLR+7Z//8AImMBPChIWJWh5GF7O243NIoKE/qbjr6vtWlu856yuliRJy8RFlKHsWcX59QtRmM82dsC22NzCpaSsmWX8p+C0vlGSJC3NsTF+8LK7YMXttHtccr7t6uYxtLdwmmbsW2ttNO+Pcp9USZK0Qh+M2bxFFYtaSNba+lNMUplwY3Nu4M6KXeY+sqqX2yedHCUA4w4fLAShh46h/MfEJE/g9ijpZFjdzGt31PY9h3J6lMU0OV+THkzu2wqeT2JZFsfco7aRQoffcUytz6JZ/U+BJElrKnPizQoCM4IE8gCeE2WuXt5qLWWKmERQRRqaR0aZD5lpWMidt3Uo14qSuuWjtR2kbdkjJjkEeV3unxllKPAdUVZIs09wjG/FpJcvb/X2oLqdNQS6e/eNkiRp+faLzZmfrM0TeEDd5h0nsteM27SBHjfuAPKTWj8wyrArSOWS89QOq1vuT0tv3vfqFhkgcm9a7gSCW8fkd8yi1VgZLknSpsXdFDabzHeH7VHy/OWdOdjH8XV79FDuHSUPIDns2jyA5NtLfQ49hlgZIkXm4iOI2Vb33xZlGHUWMdybgakkSRoBw3mZBFlrI2/Xxl0nZg29iplEWpIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZph/wPGz/nkUM44CQAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAZCAYAAACYY8ZHAAACgUlEQVR4Xu2WSchNYRjH/+YMmacQC0UoQyTjEkWyMRXJSoYyJaEsLGQjJFOJLCwMC0KIlbEkFpJCKWQeF5KF6f/veU7n/Z7vcL+F697F+dUv5/zf++k59zzv816gpKSkiLv0LX1OX9A3ns/1XNkz+pI+pb18fYSvv/Z/Z3peMxbSX/Qe7Zrk7WBFak0P1SJZE/1gD9c35DVhMKxQvY2U4fSHr+khImfokBjWiu6wQr+E/CK97WtLw9o0ujtkNUVt8hNWbBvPZtGdsEKVb/Jc6PNX0bD16oLPsGJ709b0Ju1Mt3i+Pf8oltOVyX3d8ARW7FC6li7zfJXnh/2+C71OW/p9XXEHVuxkeg35JFrk+Wm/V4vN8OtKjIK14564UC0uw4rVXpiS5Jr/yq/QQfRsslaJtrA21ID4LxxH494XEz3XGaIHGNZwuSJ6gxtjWC32w4r9GnKdA8q/031hrYj+yPdLc/qRjs+Xm0SPGMAO3g4xjGyFFbsr5D09/wQ7T/7EfHqUrqfnaCs6Enb26DpjID1E99ILSS7G0m10NewgTf9O01DDZU6SNWIdfQ+bPinZGbIm5CnT6Q3YNz+avoL9Pyom3Q/KHtFJsOmnYZJyiU6gnegt5A+hTGymi/26EG1afRNFLMDfR+o7Oi+G5BTdkNxrXD/wa7XvjmRNHKPfYHsv+6EpNPYf0yVJ9s9Ru8XTuxn9QMfR9p5pAmb7Sg+jSZj1uVp1AF1B78O+gAzlGtXqCLVoVdBrPggrQEVOhf18eehr+rUrdG4cge0btY72RjbtDsA+q3PoJGwjizH0BD1PZ3tWNXQm9AmZ9pP6O0VvqJtfZ4VmdCzIhPZaSUlJE/gNWqx/FBJsGj8AAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAZCAYAAABtnU33AAAC5klEQVR4Xu2XWaiNURTHl3meJUPqxoNZkpKIF/GkDClvpnggQ16MkZIQUiSiXEMyl8zzRYjyIKIkD2YKT4Yi/P/W2t111j3nurfbrfvp/OrX3d9/nXPu2fvbe3/7iBQpUuR/4C78AF/CV/Cs5UPhO/gGvoCv4Vs41upP4XvL+Lo9lmeCCfC3aMc8jeENq62FTVytFTwK78FBsIGr1Xm6iXbqW8g7wE9W2xBq8+HCkGWGpqKdop7t8Jblu0ONecOQZYqvktvhgfA0nG35CVcjaS1nFm5YvsMXYC842fIyVxvg2pnlgZR3eBLcaO3Rlj+0a3LetTPLNdGOcT3fga0tH2w5H0uEgxE3sHZwEyyF3XNLVWYp3AH7h7xeJbUacVy0Y8vgTJeXWM4dPA5Ggo8kTn2+xj+6qsNBeBPODfk0KVyrEbtEO3Yd1nc5O5d28HVwhqt5+Ii6EsNqME8qDiQ5J4VrNWK9aKdGxAL4IVrjqcwPhuckXAG7Su5dbubaheBnjoqhaM5zQL4a6Sg66xItRA9LpJHL87JYcndpD4+QrA2PBYNf7DO8DZfAM7AP7AefwC72unHwmLUTPOWdgvtF3xvzX3lqvCmb4SLRk94w0f+xTfS0yJnI71LpOWEW/BJD4xE8EEMHNza+t4ddc7bwC22F30U7T/bCNdb2jI+BwfxZyHqKnu972zXPCdw/+Llt4Uc4Hd6XwrPxLyVwZAwN3hlOn0JwpC+568PwkOi6e+5yjv4Yd51YHQOD+ZGQcU3zEcnlw/M9O0zaiM4oDrCf5rXCPrjS2hxV/oJaYNdb7C/vDPeClrC5ZQlO3Xww51Lz8LOnhiwxR/TxWuv0hZfhKtEjKDeuxEXRRx1rZXCn6C+tRGf4010nUs475+HyKRV9KnCtLpfyjZHTf4i1ax3uju1jKDq90hTjzsmdNMEvyuVy1WWV5Z5OUnGN+oGsc0yEj0U3tylVyDMPf5iUih4bq5IXKfIP/gACUZtb4SKE4wAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAZCAYAAABJhMI3AAADkUlEQVR4Xu2YWaiNURTHl3mey/RgSMqQIUlkyJCUKVJeEA/IkFCSDMk8RuYpXDIV4sX8YIjI+EBEIhGZMmVIwv/f2vuefZZzv+PWuZ2X/at/9/vW2ufr+9Zea6+9r0gkEolEkrgJfYQ+ub8foPfQW+gpVAC194MjRfMHegdVg0o51YJmQM+hH9DgwtGRjDCIE60xYKXomEgCDFALawyYLjGIidSBXlqjYb3EICYyDNpvjYazEoOYyEZorDUGlBft2DGICdyHmlljALsyA/jMOvJEPaiMNSbAHUd1a8wlDSR7hh0WHTPZOvJAVdHtVjfrSOAyNMcac8kISQ7iIFH/UevII02tIQuNpHiZW2x2SdFB7CJ6ajkv6eXAF6rhriuLloulYnDN8Rznqe9spGFgtzDrLLXNPd/LP6s0VDfwkZqiB4cQ/wz+rRA6AvxhIyv8sBeSHkT+uBO0FvoJLZH0WaR/DXQbWgcthE5DLZ2/u/PfgDq78XzWOWiK8/HvI6gPNBW6J+lBbwztFC3BLdAZqIroXvUAtMKNa+L8t6Dx0FJokfORgdBq6FpgmwUdh5ZB06ArUO/AT3jEPSm6fG01vkLaQG+gX6IBpL5An6Gvoo2GwWnlfxAwAOoHHRM9UzMjH0PNRZsT95vctE8Q3TrxQzj+iGiw/YRchw666yeS+hA+7wHU190PF51oMlI0sH5pWSCaifwWv+Yx2MxGZvFiqKvocdZn1jxokuhRlqyCNrlr0hq6A1Vy93sDX85g6TIQfPGe6S45Bd2F5kLjnM2Pfw31cjZumb5BbUWz7rdoxyWcfQbVw0rY5675nIfQUHfPZ3PC2Gj8R3OSGbCyopW2XbRiSDnRjD8kOgGEFRMedy9Ay4N7VkmJwAz9Lv+uJ6+g0cZGOJ4f6ku2h6SygyXF7smPZiBYuixlD8uNE8LMYlZxjWYw/BrNAFx014S/5Xv5IPI/UyzPcE33E8qGw2rkDoUZzEnie/Z34zixnOASoUD04y0dRH1c51hePjtoC8efgEa5a2bKDtGyJ+2gPdBM0fWLywabHz+a/1HimjjbjSVcSjoG91dF34OwMfKeS5NvJmNE10TCncclaL67J1x6tolmI7NwQ+DLKZm6cYjtkHa8D67HdlzC87wn7Ox202yfbTux9TNLuZx4+DxmbSbY/IZYYySZ3ZLq7gwelxm7ZEWywK69WbTpsDn+1z4xEskffwHw9aRGQewNVgAAAABJRU5ErkJggg==>