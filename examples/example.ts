import 'dotenv/config'
import { SmartFeedApi } from '../src/api'

async function example() {
  const token = process.env.PETSAFE_TOKEN!,
    smartFeed = new SmartFeedApi({ token }),
    feeders = await smartFeed.getFeeders(),
    feeder = feeders[0]

  console.log('Info', await feeder.state)

  process.exit(0)
}

example()
