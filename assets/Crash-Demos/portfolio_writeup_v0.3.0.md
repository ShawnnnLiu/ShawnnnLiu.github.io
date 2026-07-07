# Neurosymbolic Crash Anticipation — v0.3.0

**Online crash risk prediction from a single dashcam, with explainable collision-course reasoning on top.**

A neural video model watches the stream and estimates, at every frame, the probability that a crash is imminent. A symbolic layer — YOLO11n + ByteTrack perception, monocular trajectory analysis, and a transparent rule engine — grounds every alarm in a specific tracked object and emits an auditable advisory ("BRAKE + STEER LEFT — car on the right closing, TTC 1.0 s; learned risk 100%"). A distilled 2.95M-parameter student runs the neural side at 408 fps streaming.

`VideoMAE` · `Knowledge Distillation` · `Neurosymbolic AI` · `Online Anticipation` · `Monocular Geometry`

---

## What's new in v0.3.0: trajectory-aware threat discrimination

Earlier versions had a real false-alarm problem: **any car that grew in the image was treated as a potential collision**. Speed up past traffic in the next lane and the system would tell you to brake — the looming cue can't distinguish "closing on it" from "closing *with* it beside me."

v0.3.0 replaces that with a **projected-miss test** derived from pinhole geometry. For a track with image-lateral velocity `x_dot` and looming rate `L` (so TTC = 1/L), the lateral offset from the camera at the moment of closest approach — expressed in current-frame pixels — is just `x_dot · TTC`. Dividing by the object's own bounding-box width converts it to physical vehicle-widths *without any depth estimate*, because the box is a ruler at the object's distance. The rule: a finite TTC (and therefore an alarm) is only assigned when the projected miss is ≤ 1.5 vehicle-widths for several consecutive frames.

This one test fixes both failure directions:

- A car being overtaken one lane over (true gap ≈ 2 vehicle-widths) projects to a ~2-width miss and stays silent **no matter how fast we close on it**.
- A cut-in converging on our lane keeps its finite TTC **even while sliding across the image** — the case the old fixed bearing-rate threshold could miss entirely.

The ego corridor is likewise perspective-corrected: "in path" now means within ~1.2 object-widths of straight-ahead *at the object's own depth*, so the corridor narrows toward the vanishing point instead of swallowing every distant car regardless of lane.

The demo farm (`outputs/demos_v0.3.0_projected-miss/`, 17 crash + 3 no-crash clips) renders the full stack frame-by-frame; vehicles we merely pass now read `TTC --` where v0.2.0 showed them counting down.

## Architecture

```
dashcam stream ──► VideoMAE-S teacher / MobileNetV2-GRU student ──► risk p_t ──┐
             └──► YOLO11n + ByteTrack ──► track dynamics                       ├──► rule engine ──► advisory + rationale
                                          (looming → TTC, projected miss,     ─┘
                                           perspective corridor, heading)
```

The neural network decides *whether* the situation is dangerous; the symbolic layer decides *what the threat is and what to do about it* — and can always explain itself.

## Metrics — and how honestly to read them

Online evaluation over **300 CCD crash videos + 301 DAD no-crash videos**, streamed frame-by-frame. Positives are scored by their maximum risk *before* accident onset; firing after impact does not count.

| | VideoMAE-S (teacher) | MobileNetV2-GRU (student) |
|---|---|---|
| Parameters | 21.88 M | **2.95 M** |
| Video AP / AUROC | 0.9998 / 0.9998 | 0.9998 / 0.9998 |
| Recall / precision @ 0.5 | 0.993 / 1.000 | 0.993 / 0.990 |
| False alarms per no-crash video | 0.000 | 0.010 |
| Mean time-to-accident at alarm (mTTA) | 2.04 s | **3.05 s** |
| Framewise AP, same-domain temporal negatives | 0.976 | 0.971 |
| Latency (RTX 5070 Ti) | 16.9 ms / window (59 fps) | 3.4 ms window; **2.45 ms/frame streaming (408 fps)** |

Robustness held across the annotated conditions (AP ≥ 0.999 for day/night, normal/rain/snow, ego-involved or not — though rain is only n=18 and night n=41, too few to claim much).

**These numbers are real, and they should still be read skeptically.** Three reasons:

1. **Cross-dataset negatives.** Crash clips come from CCD (global YouTube footage); no-crash clips from DAD (Taiwan dashcams). A model can partly separate the two by domain cues — camera, geography, compression — rather than by danger. The same-domain framewise AP (0.976 on temporal negatives cut from the *same* crash videos) is the honest guard metric, and it is good but not perfect. A single-domain benchmark is the planned fix.
2. **Five-second clips with the accident near the end.** The false-alarm rate over *hours* of uneventful driving — the number that actually decides whether a driver tolerates the system — is unmeasured.
3. **The benchmark is near-saturated**, which means it can no longer distinguish a better model from a worse one. Saturation is a property of the test, not proof of a solved problem.

**What is *not* in these numbers:** the symbolic layer. The AP/mTTA table scores the neural risk signal only. The projected-miss layer is currently validated by unit tests on synthetic pinhole-projected scenarios (overtake, cut-in, head-on, perspective corridor) and by qualitative behavior on the demo clips — there is no quantitative benchmark for advisory correctness yet. That is a genuine open gap.

## Current downfalls, stated plainly

The v0.3.0 layer is a large step up from "looming = danger", but it is **image-space geometry with assumptions, not spatial understanding**:

- **No metric 3D state.** Everything is inferred from bounding boxes in pixels. There is no depth, no ego-lane geometry, no map — the system knows "closing, will pass ~2 widths to the left," not *where anything actually is*.
- **Constant-velocity, zero-yaw assumptions.** The projected miss extrapolates ~0.6 s of track history linearly and assumes the camera isn't rotating. During the ego vehicle's own turns and lane changes, the whole image acquires lateral flow and the test degrades; curved roads bend "straight ahead" away from the image center.
- **Perception is the bottleneck at the worst moment.** ByteTrack loses the threat vehicle at very close range (motion blur, extreme scale) — visible in the demos, where the final pre-impact frames fall back to the neural-risk-only rule ("threat not localized by tracker").
- **Box width as a ruler is class-blind.** Normalizing by box width assumes vehicle-like proportions; partial occlusion, clipped boxes, and motorcycles-vs-trucks shift the effective threshold.
- **No world persistence.** A car occluded for ten frames is a brand-new object with no history; parked cars and stopped traffic are indistinguishable until something moves.

## Next: from image-space heuristics to a world model

The honest way to describe the current system is *2.5D heuristics on a 2D image*. Real spatial awareness means maintaining a persistent, metric model of the scene — a world model — and there is a pragmatic ladder to it, each rung fixing a named failure above:

1. **Ego-motion estimation** (monocular visual odometry, or IMU when available). Compensates the yaw term that currently breaks the miss test in turns, and separates ego-induced image motion from real object motion — which also finally distinguishes parked cars from stopped traffic.
2. **Metric depth → bird's-eye-view state.** A monocular depth model (Metric3D / Depth Anything-class) plus a ground-plane assumption lifts each track into metric ego coordinates. A Kalman filter over BEV positions gives real trajectories, real closing speeds, and TTC in meters — replacing every "box width as a ruler" heuristic with measurement.
3. **Short-horizon occupancy forecasting.** Predict each agent's occupancy 1–3 s ahead in BEV and intersect it with the ego corridor. At this point "collision course" is a geometric fact about predicted occupancy, not a per-track heuristic — and the symbolic rules get strictly better facts to fire on.
4. **Learned world models.** The research endgame: a model that predicts scene evolution directly (occupancy/video prediction), with the rule layer auditing its rollouts. Data-hungry and heavy — the geometric rungs above capture most of the practical value first, which is why they come first.

Also on the roadmap: a single-domain benchmark (CCD's normal clips), a quantitative benchmark for the *advisory* layer (per-object collision-course labels), long-duration false-alarm measurement, and closed-loop evaluation in CARLA.

---

*Stack: PyTorch · VideoMAE-S · MobileNetV2+GRU distillation · YOLO11n + ByteTrack · classical monocular geometry · earliness-weighted BCE (Chan et al., 2016) · evaluated on CCD + DAD.*
