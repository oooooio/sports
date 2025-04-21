import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

export function SkillAssessmentForm() {
  // Mock data - assessment criteria
  const criteria = [
    {
      id: "technique",
      name: "Technical Ability",
      description: "Player's basic technical level",
    },
    {
      id: "physical",
      name: "Physical Attributes",
      description: "Player's fitness and physical condition",
    },
    {
      id: "tactical",
      name: "Tactical Understanding",
      description: "Player's understanding and execution of tactics",
    },
    {
      id: "mental",
      name: "Mental Attributes",
      description: "Player's psychological state and match mentality",
    },
  ]

  return (
    <form className="space-y-6">
      {criteria.map((criterion) => (
        <div key={criterion.id} className="space-y-2">
          <div>
            <Label>{criterion.name}</Label>
            <p className="text-sm text-muted-foreground">{criterion.description}</p>
          </div>

          <RadioGroup defaultValue="3">
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id={`${criterion.id}-1`} />
                <Label htmlFor={`${criterion.id}-1`}>1 - Poor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id={`${criterion.id}-2`} />
                <Label htmlFor={`${criterion.id}-2`}>2 - Average</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id={`${criterion.id}-3`} />
                <Label htmlFor={`${criterion.id}-3`}>3 - Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id={`${criterion.id}-4`} />
                <Label htmlFor={`${criterion.id}-4`}>4 - Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id={`${criterion.id}-5`} />
                <Label htmlFor={`${criterion.id}-5`}>5 - Outstanding</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="comments">Assessment Comments</Label>
        <Textarea id="comments" placeholder="Enter assessment comments for this player..." />
      </div>

      <Button className="w-full">Submit Assessment</Button>
    </form>
  )
}
