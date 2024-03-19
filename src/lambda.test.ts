import { AppConfigProvider } from "@aws-lambda-powertools/parameters/appconfig"
import { getParameter } from "@aws-lambda-powertools/parameters/ssm"
import { handler } from "./lambda"

jest.mock("@aws-lambda-powertools/parameters/ssm", () => ({
    getParameter: jest.fn(),
}))
const mockedGetParameter = getParameter as jest.MockedFunction<
    typeof getParameter
>

jest.mock("@aws-lambda-powertools/parameters/appconfig")
const mockedAppConfigProvider = AppConfigProvider as jest.MockedClass<
    typeof AppConfigProvider
>

describe("Lambda tests", () => {
    const env = process.env

    beforeEach(() => {
        mockedGetParameter.mockClear()
        mockedAppConfigProvider.mockClear()
        jest.resetModules()
        process.env = { ...env }
    })

    afterEach(() => {
        process.env = env
    })

    test("it returns the correct response", async () => {
        mockedGetParameter.mockResolvedValue("MyName")
        process.env.APP_TEAM = "MyTeam"
        process.env.APP_DOMAIN = "MyDomain"
        // uncomment to fix the error
        //// @ts-expect-error "avoid multi type return error"
        mockedAppConfigProvider.prototype.get.mockResolvedValue({ foo: "bar" })

        const result = await handler()

        expect(JSON.parse(result.body)).toEqual({
            message: "Hello MyName",
            team: "MyTeam",
            domain: "MyDomain",
            progressiveRollout: {
                foo: "bar",
            },
        })
    })
})
