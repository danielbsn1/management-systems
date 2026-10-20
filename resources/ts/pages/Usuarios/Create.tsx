import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/Field";

export default function UsuariosCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post("/usuarios");
    }

    return (
        <AppLayout title="Novo Usuário">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Cadastrar Usuário
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Crie um novo acesso ao sistema
                    </p>
                </div>
                <Button render={<Link href="/usuarios" />} variant="outline">
                    Voltar
                </Button>
            </div>

            <Card className="mx-auto max-w-3xl">
                <form onSubmit={handleSubmit} id="create-user-form">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Nome" required error={errors.name}>
                                <Input
                                autoComplete="off"
                                    type="text"
                                    placeholder="Nome completo"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    aria-invalid={!!errors.name}
                                />
                            </Field>

                            <Field label="E-mail" required error={errors.email}>
                                <Input
                                autoComplete="off"
                                    type="email"
                                    placeholder="usuario@email.com"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    aria-invalid={!!errors.email}
                                />
                            </Field>

                            <Field label="Senha" required error={errors.password}>
                                <Input
                                autoComplete="new-password"
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    aria-invalid={!!errors.password}
                                />
                            </Field>

                            <Field
                                label="Confirmar Senha"
                                required
                                error={errors.password_confirmation}
                            >
                                <Input
                                autoComplete="new-password"
                                    type="password"
                                    placeholder="Repita a senha"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData("password_confirmation", e.target.value)
                                    }
                                    aria-invalid={!!errors.password_confirmation}
                                />
                            </Field>

                            <Field label="Perfil" required error={errors.role}>
                                <Select
                                    value={data.role || null}
                                    onValueChange={(value) =>
                                        setData("role", value ?? "")
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="user">Colaborador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </CardContent>

                    <CardFooter className="justify-end gap-2">
                        <Button render={<Link href="/usuarios" />} variant="outline">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Salvando..." : "Cadastrar"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </AppLayout>
    );
}
