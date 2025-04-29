// Data fetching and processing utilities

// Function to fetch employee billing data from the CSV file
export async function fetchEmployeeBillingData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/employee_2185_billing_updated-AQTSQXnplVe75z66zCqpF6kJbaenf2.csv",
)

if (!response.ok) {
      throw new Error(`Failed to fetch employee billing data: ${response.status}`)
    }

    const csvText = await response.text()
    return parseCSV(csvText)
  } catch (error) {
    console.error("Error fetching employee billing data:", error)
    return []
  }
}

// Function to fetch project data (placeholder - will be updated when CSV is provided)
export async function fetchProjectData() {
  // This will be implemented when the project CSV is provided
  return []
}

// Function to fetch billing data (placeholder - will be updated when CSV is provided)
export async function fetchBillingData() {
  // This will be implemented when the billing CSV is provided
  return []
}

// Helper function to parse CSV data
function parseCSV(csvText: string) {
  const lines = csvText.split("\n")
  if (lines.length === 0) return []

  const headers = lines[0].split(",").map((header) => header.trim())
  const data = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const values = lines[i].split(",").map((value) => value.trim())
    if (values.length !== headers.length) continue

    const entry = {}
    headers.forEach((header, index) => {
      entry[header] = values[index]
    })

    data.push(entry)
  }

  return data
}
